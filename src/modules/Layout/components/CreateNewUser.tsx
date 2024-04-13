import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { serialize } from "borsh";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { useWallet } from "@solana/wallet-adapter-react";
import { env } from "~/env";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import crypto from "crypto";
import nacl from "tweetnacl";
import { Button } from "~/components/ui/button";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { useAuthStore } from "~/modules/Auth/store/store";
import ipfs from "~/modules/Files/FileUpload/components/utils/IpfsConfiguration";

const PROGRAM_ID = new PublicKey(env.NEXT_PUBLIC_USERS_CONTRACT_ADDRESS);

// Matching the Rust struct with JavaScript class
class UserMetadata {
  user_solana: string;
  did_public_address: string;

  constructor({
    user_solana,
    did_public_address,
  }: {
    user_solana: string;
    did_public_address: string;
  }) {
    this.user_solana = user_solana;
    this.did_public_address = did_public_address;
  }
}

const UserMetadataSchema = new Map([
  [
    UserMetadata,
    {
      kind: "struct",
      fields: [
        ["user_solana", "string"],
        ["did_public_address", "string"],
      ],
    },
  ],
]);

export const SIGN_MESSAGE = "Sign this message to generate your DID.";

const CreateUserButton: React.FC = () => {
  const wallet = useWallet();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { changeAuthModalVisibility } = useAuthStore();

  // const formatKeyToByte32Key = (theSignedMsg: string) => {
  //   const hash = crypto.createHash("sha256");
  //   hash.update(theSignedMsg);
  //   return hash.digest();
  // };
  const generateUniqueCredentials = async (provider) => {
    const encodedMessage = new TextEncoder().encode(SIGN_MESSAGE);

    // Request signature from the user
    const signedMessage = await provider.signMessage(encodedMessage);
    const seed = crypto
      .createHash("sha256")
      .update(signedMessage)
      .digest()
      .slice(0, 32);
    const keyPair = nacl.sign.keyPair.fromSeed(seed);
    const publicKeyString = bs58.encode(keyPair.publicKey);
    const privateKeyString = bs58.encode(keyPair.secretKey);
    return { publicKeyString, privateKeyString };
  };

  const generateUserCredentials = async () => {
    // validate if no wallet is found in the explorer.
    const provider = window.solana;
    if (!provider) {
      alert("solana is not found.");

      return;
    }

    const walletPublicKey = provider.publicKey.toString();
    await provider.connect();
    const { publicKeyString } = await generateUniqueCredentials(provider);
    const newDidId = crypto.createHash("sha256").digest().toString();
    const didDocument = {
      did: `did:filesharing:${newDidId}`,
      username: username,
      walletPublicKey: walletPublicKey,
      didPublicKey: publicKeyString,
    };
    const { cid } = await ipfs.add(JSON.stringify(didDocument));
    return { cid: cid.toString() };
  };

  const createUser = async () => {
    console.log(wallet);
    const provider = window.solana;
    if (!provider) {
      alert("solana is not found.");
      return;
    }
    const walletPublicKey = provider.publicKey.toString();

    if (!walletPublicKey) {
      alert("no wallet found");
      return;
    }

    if (!username) {
      alert("Provide a username to continue");
      return;
    }

    setIsLoading(true);
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const result = await generateUserCredentials();
    if (!result?.cid) {
      return alert("there was an error!");
    }

    const userMetadata = new UserMetadata({
      user_solana: walletPublicKey.toString(),
      did_public_address: result?.cid!,
    });

    const userMetadataBuffer = Buffer.from(
      serialize(UserMetadataSchema, userMetadata),
    );

    const customInstruction = new TransactionInstruction({
      keys: [],
      programId: PROGRAM_ID,
      data: userMetadataBuffer,
    });

    let transaction = new Transaction().add(customInstruction);
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;

    try {
      console.log("Signing and sending transaction...");

      // The wallet's signAndSendTransaction method is used here
      let signedTransaction = await wallet.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" },
      );

      console.log("Waiting for confirmation...");
      await connection.confirmTransaction(signature, "confirmed");

      console.log("Transaction confirmed with signature:", signature);
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsLoading(false);
      changeAuthModalVisibility(false);
    }
  };

  return (
    <AllSolanaContent>
      <Label>Claim your username :</Label>
      <Input onChange={(e) => setUsername(e.target.value)} value={username} />
      <Button
        className="mt-2 w-full text-white"
        loading={isLoading}
        onClick={createUser}
      >
        Create User
      </Button>
    </AllSolanaContent>
  );
};

export default CreateUserButton;
