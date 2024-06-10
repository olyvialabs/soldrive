import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "~/components/ui/button";
import { Buffer } from "buffer";

const PROGRAM_ID = new PublicKey(
  "DQozU1hdPhGKPPL3dWonTmfe6w6uydqudrbspmkpfaVW",
);
const TOKEN_MINT = new PublicKey(
  "9GBNjXFfsuoTrrQDRVaV9xCDQwzpWSGJuwMjLwb8RXAY",
);

const UpgradeToProButton = ({ onUpgrade }: { onUpgrade?: () => void }) => {
  const wallet = useWallet();
  const toPublicKey = wallet.publicKey?.toString();
  const amount = 190_000;
  const [isLoading, setIsLoading] = useState(false);

  const transferBonkTokens = async () => {
    if (!wallet?.publicKey) {
      alert("Connect your wallet to continue");
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      // Get or create associated token accounts
      const fromAta = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        TOKEN_MINT,
        wallet.publicKey,
      );
      const toAta = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        TOKEN_MINT,
        new PublicKey(toPublicKey),
      );

      const transferAmount = new BN(amount);
      const dataBuffer = Buffer.alloc(8);
      dataBuffer.writeBigUInt64LE(
        transferAmount.toArrayLike(Buffer, "le", 8),
        0,
      );

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
          { pubkey: fromAta.address, isSigner: false, isWritable: true },
          { pubkey: toAta.address, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: PROGRAM_ID,
        data: dataBuffer,
      });

      const transaction = new Transaction().add(instruction);
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const txHash = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" },
      );

      await connection.confirmTransaction(txHash, "finalized");
      alert(`Transaction successful! TxHash: ${txHash}`);
    } catch (error) {
      console.log({ error });
      console.log({ error });
      console.error("Transaction failed", error);
    } finally {
      setIsLoading(false);
      onUpgrade?.();
    }
  };

  return (
    <>
      <div className="flex w-full text-center">
        <span>Equivalent of $5 dollars is {amount} $BONKS</span>
      </div>

      <Button
        className="mt-2 w-full  text-white md:w-auto"
        loading={isLoading}
        onClick={transferBonkTokens}
      >
        Upgrade to PRO with $BONK
      </Button>
    </>
  );
};

export default UpgradeToProButton;
