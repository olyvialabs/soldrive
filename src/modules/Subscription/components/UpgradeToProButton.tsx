import React, { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "~/components/ui/button";
import { BN } from "bn.js";
import * as anchor from "@project-serum/anchor";
import { toast } from "sonner";

const PROGRAM_ID = new PublicKey(
  "DQozU1hdPhGKPPL3dWonTmfe6w6uydqudrbspmkpfaVW",
);
const TOKEN_MINT = new PublicKey(
  "9GBNjXFfsuoTrrQDRVaV9xCDQwzpWSGJuwMjLwb8RXAY",
);

const idl = {
  version: "0.1.0",
  name: "bonk_suscription",
  instructions: [
    {
      name: "transferLamports",
      accounts: [
        {
          name: "from",
          isMut: true,
          isSigner: true,
        },
        {
          name: "to",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "transferSplTokens",
      accounts: [
        {
          name: "from",
          isMut: false,
          isSigner: true,
        },
        {
          name: "fromAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "toAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  metadata: {
    address: "DQozU1hdPhGKPPL3dWonTmfe6w6uydqudrbspmkpfaVW",
  },
};

const UpgradeToProButton = ({ onUpgrade }: { onUpgrade?: () => void }) => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const amount = new BN(190_000); // TBD HOW much to send later,

  const transferBonkTokens = async () => {
    if (!wallet || !wallet.publicKey) {
      alert("Connect your wallet to continue");
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
      });
      anchor.setProvider(provider);

      const program = new anchor.Program(idl, PROGRAM_ID, provider);

      const fromAta = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet?.publicKey,
        TOKEN_MINT,
        wallet.publicKey,
      );
      const toAta = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet?.publicKey,
        TOKEN_MINT,
        new PublicKey("FYMwG2PmdjMaqq1PS92TmH5ntb6UgCENZALywNCKK4XT"),
      );

      console.log("fromAta:", fromAta.address.toBase58());
      console.log("toAta:", toAta.address.toBase58());

      const txHash = await program?.methods
        .transferSplTokens(amount)
        .accounts({
          from: wallet.publicKey,
          fromAta: fromAta.address,
          toAta: toAta.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([]) // No additional signers needed
        .rpc();

      await connection.confirmTransaction(txHash, "finalized");
      toast("Thank you! You are subscribed now" {
        description: "You paid for a one month subscription",
      });
      console.log(`Transaction successful! TxHash: ${txHash}`);
    } catch (error) {
      console.error("Transaction failed", error);
      toast("Error processing subscription!", {
        description: "Please contact support if this issue persist",
      });
      if (error?.logs) {
        console.log("Transaction logs:", error.logs);
      }
      if (error?.message) {
        console.log(`Transaction failed: ${error.message}`);
      } else {
        console.log("Transaction failed");
      }
    } finally {
      setIsLoading(false);
      onUpgrade?.();
    }
  };

  return (
    <>
      <div className="flex w-full text-center">
        <span>Equivalent of $5 dollars is {amount.toString()} $BONKS</span>
      </div>

      <Button
        className="mt-2 w-full text-white md:w-auto"
        loading={isLoading}
        onClick={transferBonkTokens}
      >
        Upgrade to PRO with $BONK
      </Button>
    </>
  );
};

export default UpgradeToProButton;
