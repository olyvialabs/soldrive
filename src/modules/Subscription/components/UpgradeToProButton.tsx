import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { BN } from "bn.js";
const PROGRAM_ID = new PublicKey(
  "DQozU1hdPhGKPPL3dWonTmfe6w6uydqudrbspmkpfaVW",
);
const TOKEN_MINT = new PublicKey(
  "9GBNjXFfsuoTrrQDRVaV9xCDQwzpWSGJuwMjLwb8RXAY",
);

const UpgradeToProButton = ({ onUpgrade }: { onUpgrade?: () => void }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  // public key which would be used to receive $BONK tokens
  const toPublicKey = new PublicKey(
    "FYMwG2PmdjMaqq1PS92TmH5ntb6UgCENZALywNCKK4XT",
  ); // SOLDRIVE OWNER
  const amount = 190_000;
  const [isLoading, setIsLoading] = useState(false);

  const transferBonkTokens = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wallet?.publicKey) {
      alert("Connect your wallet to continue");
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      // Get or create associated token accounts
      const fromAta = await getAssociatedTokenAddress(
        TOKEN_MINT,
        wallet.publicKey,
        undefined,
        PROGRAM_ID,
      );

      const toAta = await getAssociatedTokenAddress(
        TOKEN_MINT,
        new PublicKey(toPublicKey),
        undefined,
        PROGRAM_ID,
      );

      console.log({ fromAta, toAta });

      if (!fromAta.toString()) {
        toast(`You don't have $BONKS Tokens in this account`, {
          description: "Get some $BONKS and try again...",
        });
      }

      const transaction = new Transaction().add(
        createTransferInstruction(
          fromAta,
          toAta,
          wallet.publicKey,
          new BN(amount), // * LAMPORTS_PER_SOL,
          [], //,
          //PROGRAM_ID,
        ),
      );
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
      onUpgrade?.();
    } catch (error) {
      toast("Error processing subscription!", {
        description: "Please contact support if this issue persist",
      });
      console.log({ error });
      console.error("Transaction failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full text-center">
        <span>
          Equivalent of <b className="text-purple-500">$5 dollars</b> is{" "}
          <b className="text-purple-500">{amount} $BONKS</b>
        </span>
      </div>

      <Button
        disabled
        className="mt-2 flex w-full flex-1 text-white"
        loading={isLoading}
        onClick={transferBonkTokens}
        type="button"
      >
        Upgrade to PRO with $BONK
      </Button>
      <span className="text-sm text-gray-500">
        Subscription are currently disabled.
      </span>
    </>
  );
};

export default UpgradeToProButton;
