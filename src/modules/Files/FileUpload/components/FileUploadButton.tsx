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
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import useContractIndexer from "../../hooks/useContractIndexer";
import useGetAllFilesByWalletIndexer from "../../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";
import { toast } from "sonner";

const PROGRAM_ID = new PublicKey(
  env.NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS,
);

class TokenMetadata {
  constructor(properties) {
    Object.assign(this, properties);
  }
}

class Assignable {
  constructor(properties) {
    Object.assign(this, properties);
  }
}

class InstructionPayload extends Assignable {}

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
        ["version", "string"],
      ],
    },
  ],
]);

const InstructionPayloadSchema = new Map([
  [
    InstructionPayload,
    {
      kind: "struct",
      fields: [
        ["variant", "u8"],
        ["token_metadata", TokenMetadata],
      ],
    },
  ],
  ...TokenMetadataSchema,
]);

export const useSaveFileDataOnChain = () => {
  const { publicKey, signTransaction } = useWallet();
  const { currentFolderInformation } = useFilesStore();
  const [isLoading, setIsLoading] = useState(false);
  const { manualSyncFileCreation } = useContractIndexer();
  const { changeForcedUploadFiles, forcedUploadFiles } = useFilesStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const wallet = useWallet();

  const mintToken = async ({
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
      toast("Wallet not connected");
      return;
    }
    try {
      setIsLoading(true);
      const connection = new Connection(
        clusterApiUrl(env.NEXT_PUBLIC_SOLANA_NETWORK),
        "confirmed",
      );
      const newToken = {
        file_id: uuidv4(),
        name: name,
        weight: weight || 0,
        file_parent_id:
          file_parent_id || currentFolderInformation.fileData?.file_id || "",
        cid: cid || "",
        typ: typ || "file",
        from,
        to,
        version: "1",
      };
      const tokenMetadata = new TokenMetadata(newToken);

      const instructionPayload = new InstructionPayload({
        variant: 1, // 1 for TokenMetadata
        token_metadata: tokenMetadata,
      });

      // Serialize the instruction payload
      const serializedData = serialize(
        InstructionPayloadSchema,
        instructionPayload,
      );
      const instructionBuffer = Buffer.from(serializedData);

      // Define the instruction for sending the token metadata
      const customInstruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          // Add more keys as needed by your instruction
        ],
        programId: PROGRAM_ID,
        data: instructionBuffer,
      });

      let transaction = new Transaction().add(customInstruction);
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;

      // Assign a recent blockhash to the transaction
      const { blockhash } = await connection.getRecentBlockhash("finalized");
      transaction.recentBlockhash = blockhash;

      // Sign the transaction through the wallet
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature, "finalized");
      toast(
        `New ${typ === "file" ? "File" : "Folder"} ${newToken.name} created.`,
      );
      await manualSyncFileCreation(newToken);
      if (forcedUploadFiles) {
        changeForcedUploadFiles(false);
      }
      // on create new file, reload all data
      await getFilesByWallet(newToken.from);
    } catch (error) {
      if (error?.message?.includes("credit")) {
        toast("Not enough balance to make transaction.", {
          position: "top-center",
          description: "Get Solana($SOL) and try again",
        });
      } else {
        toast("There was an error creating new file.", {
          position: "top-center",
          description: `Please contact support. ${error?.message || ""}`,
        });
      }
      console.log("Transaction failed", error);
    }
    setIsLoading(false);
  };

  return { mintToken, isLoading };
};
const FileUploadButton = ({
  folderName,
  onComplete,
}: {
  folderName: string;
  onComplete: () => void;
}) => {
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
        }).then(() => {
          onComplete();
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
