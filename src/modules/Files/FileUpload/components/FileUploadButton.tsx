import React, { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  Keypair,
  Signer,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { serialize } from "borsh";
import { Buffer } from "buffer";
import bs58 from "bs58";
import { v4 as uuidv4 } from "uuid";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

const PROGRAM_ID = new PublicKey(
  env.NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS,
);

class TokenMetadata {
  constructor({ file_id, name, weight, file_parent_id, cid, typ, from, to }) {
    this.file_id = file_id;
    this.name = name;
    this.weight = BigInt(weight);
    this.file_parent_id = file_parent_id;
    this.cid = cid;
    this.typ = typ;
    this.from = from;
    this.to = to;
  }
}

const TokenMetadataSchema = new Map([
  [
    TokenMetadata,
    {
      kind: "struct",
      fields: [
        ["file_id", "string"],
        ["name", "string"],
        ["weight", "u64"],
        ["file_parent_id", "string"],
        ["cid", "string"],
        ["typ", "string"],
        ["from", "string"],
        ["to", "string"],
      ],
    },
  ],
]);

export const useSaveFileDataOnChain = () => {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();

  const mintToken = useCallback(
    async ({
      name,
      file_parent_id,
      weight,
      typ,
      cid,
      from,
      to,
    }: {
      name: string;
      file_parent_id?: string;
      weight?: number;
      typ?: string;
      cid?: string;
      from: string;
      to: string;
    }) => {
      if (!publicKey || !signTransaction) {
        console.log("Wallet not connected");
        return;
      }
      setIsLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const metadata = new TokenMetadata({
        file_id: uuidv4(),
        name: name,
        weight: weight || 0,
        file_parent_id: file_parent_id || "",
        cid: cid || "",
        typ: typ || "file",
        from,
        to,
      });

      const metadataBuffer = Buffer.from(
        serialize(TokenMetadataSchema, metadata),
      );

      const customInstruction = new TransactionInstruction({
        keys: [],
        programId: PROGRAM_ID,
        data: metadataBuffer,
      });

      let transaction = new Transaction().add(customInstruction);
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;

      console.log({ transaction });
      // Assign a recent blockhash to the transaction
      const { blockhash } = await connection.getRecentBlockhash("finalized");
      transaction.recentBlockhash = blockhash;

      // Sign the transaction through the wallet
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );
      console.log({ signature, signTransaction });

      // Confirm the transaction
      await connection.confirmTransaction(signature, "finalized");
      console.log("Transaction confirmed with signature:", signature);
      setIsLoading(false);
    },
    [publicKey, signTransaction, name],
  );

  return { mintToken, isLoading };
};
const FileUploadButton = ({ folderName }: { folderName: string }) => {
  const { isLoading, mintToken } = useSaveFileDataOnChain();
  const wallet = useWallet();
  return (
    <Button
      size="lg"
      className="text-white"
      onClick={() =>
        mintToken({
          name: folderName,
          typ: "folder",
          from: wallet.publicKey?.toString() || "",
          to: wallet.publicKey?.toString() || "",
        })
      }
      disabled={isLoading}
      loading={isLoading}
    >
      {isLoading ? "Creating..." : "Create"}
    </Button>
  );
};

export default FileUploadButton;
