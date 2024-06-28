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
import { useAuthStore } from "~/modules/Store/Auth/store";
import ipfs from "~/modules/Files/FileUpload/components/utils/IpfsConfiguration";
import useContractIndexer from "~/modules/Files/hooks/useContractIndexer";
import { toast } from "sonner";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";
import { DownloadIcon, HandIcon, InputIcon } from "@radix-ui/react-icons";

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

const CreateUserButton: React.FC = () => {
  const wallet = useWallet();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    changeAuthModalVisibility,
    setUserInformationData,
    setSubscriptionTimestamp,
  } = useAuthStore();
  const {
    manualSyncUserCreation,
    getUserSubscriptionByWallet,
    searchUsernames,
  } = useContractIndexer();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();

  const createNewDidUserCredentials = async () => {
    // validate if no wallet is found in the explorer.
    const provider = window.solana;
    if (!provider) {
      toast("Solana Provider was not found :(", {
        description: "Please try installing solana before continuing",
        position: "top-center",
      });
      return {};
    }

    const walletPublicKey = provider.publicKey.toString();
    await provider.connect();
    const { publicKeyString } = await generateUniqueCredentials();
    const newDidId = crypto.createHash("sha256").digest().toString();
    const didDocument = {
      did: `did:v1:filesharing:${newDidId}`,
      username: username,
      walletPublicKey: walletPublicKey,
      didPublicKey: publicKeyString,
    };
    const { cid } = await ipfs.add(JSON.stringify(didDocument));
    return { cid: cid.toString(), username, didPublicKey: publicKeyString };
  };

  const createUser = async () => {
    const provider = window.solana;
    if (!provider) {
      toast("Solana Wallet not found", {
        description: "Please install Phantom or similar wallet to continue",
      });
      return;
    }
    const walletPublicKey = provider.publicKey.toString();

    if (!walletPublicKey) {
      toast("Solana Wallet not found", {
        description: "Please install Phantom or similar wallet to continue",
        icon: <DownloadIcon />,
      });
      return;
    }

    if (!username) {
      toast("Username field empty", {
        description: "Please add a username to continue",
        icon: <InputIcon />,
      });
      return;
    }

    setIsLoading(true);

    // tsett
    const foundUserWithUsername = await searchUsernames({ username, limit: 1 });
    if (!foundUserWithUsername?.success || foundUserWithUsername?.error) {
      toast("Error retrieving username information", {
        description: `There was an issue retrieving user's username`,
        icon: <HandIcon />,
      });
      setIsLoading(false);
      return;
    }
    if (foundUserWithUsername?.data?.length) {
      const theOtherWallet = foundUserWithUsername.data[0]?.user_solana;
      toast("Username already taken", {
        description: `Change it or Fight with ${theOtherWallet} for it`,
        icon: <HandIcon />,
      });
      setIsLoading(false);
      return;
    }

    const result = await createNewDidUserCredentials();
    if (!result?.cid) {
      toast("Error creating user DID", {
        description:
          "There was an issue generating your DID, please contact support",
        icon: <DownloadIcon />,
      });
      setIsLoading(false);
      return;
    }

    const userData = {
      user_solana: walletPublicKey.toString(),
      did_public_address: result?.cid!,
    };
    const userMetadata = new UserMetadata(userData);

    const userMetadataBuffer = Buffer.from(
      serialize(UserMetadataSchema, userMetadata),
    );

    const customInstruction = new TransactionInstruction({
      keys: [],
      programId: PROGRAM_ID,
      data: userMetadataBuffer,
    });
    try {
      const connection = new Connection(
        clusterApiUrl(env.NEXT_PUBLIC_SOLANA_NETWORK),
        "confirmed",
      );
      let transaction = new Transaction().add(customInstruction);
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;

      // The wallet's signAndSendTransaction method is used here
      let signedTransaction = await wallet.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" },
      );
      const responses = await Promise.allSettled([
        connection.confirmTransaction(signature, "confirmed"),
        manualSyncUserCreation({
          ...userData,
          username: result?.username!,
          did_public_key: result?.didPublicKey!,
        }),
        getUserSubscriptionByWallet({
          walletAddress: wallet?.publicKey?.toString()!,
        }),
      ]);
      const response =
        responses[2].status === "fulfilled"
          ? responses[2].value
          : { data: { id: "", timestamp: "0" } };
      const timestamp = response?.data?.id
        ? parseInt(response?.data?.timestamp || "0")
        : 0;
      if (response?.data?.id) {
        setSubscriptionTimestamp(timestamp || 0);
      }
      setUserInformationData({
        ...userData,
        username: result?.username!,
        did_public_key: result?.didPublicKey!,
      });
      changeAuthModalVisibility(false);
    } catch (error) {
      if (error?.message?.includes("credit")) {
        toast("Not enough balance to make transaction.", {
          position: "top-center",
          description: "Get Solana($SOL) and try again",
        });
      } else {
        toast("There was an error creating a new user.", {
          position: "top-center",
          description: `Please contact support. ${error?.message || ""}`,
        });
      }
      console.log("Transaction failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 40);
    setUsername(value);
  };

  // <AllSolanaContent>
  return (
    <>
      <Label>Secure Your Username</Label>
      <Input
        onChange={handleUsernameChange}
        value={username}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            createUser();
          }
        }}
      />
      <Button
        className="mt-2 w-full text-white"
        loading={isLoading}
        onClick={createUser}
      >
        Register User
      </Button>
    </>
  );
};

export default CreateUserButton;
