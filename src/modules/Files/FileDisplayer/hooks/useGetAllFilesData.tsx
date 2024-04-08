import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import bs58 from "bs58";
import { env } from "~/env";
import { FileDetails } from "../types";

const alchemyEndpoint =
  "https://solana-devnet.g.alchemy.com/v2/zEDWpOFCLIVzNr7iqfQmypknGRQSV0jX";
const connection = new Connection(alchemyEndpoint, "confirmed");

const useTokenBalances = (walletAddress) => {
  const [balances, setBalances] = useState<FileDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletAddress) {
      return;
    }
    const parseMetadata = (metadataString) => {
      const metadata = {};
      const parts = metadataString
        .replace("Program log: Deserialized metadata: TokenMetadata { ", "")
        .replace(" }", "")
        .split(", ");

      parts.forEach((part) => {
        const [key, value] = part.split(": ");
        metadata[key.trim()] = value.replace(/"/g, "");
      });

      return metadata;
    };

    const getContractLogs = async (contractAddress) => {
      const publicKey = new PublicKey(contractAddress);
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      });
      const allLogs = [];

      for (let signatureInfo of signatures) {
        try {
          const transaction = await connection.getTransaction(
            signatureInfo.signature,
            { commitment: "confirmed" },
          );
          if (transaction && transaction.meta && transaction.meta.logMessages) {
            const mintMessages = transaction.meta.logMessages.filter((log) =>
              log.includes("Token minted with mint address:"),
            );
            console.log({ mintMessages });
            console.log({ mintMessages });
            console.log({ mintMessages });
            const metadataMessages = transaction.meta.logMessages.filter(
              (log) => log.startsWith("Program log: Deserialized metadata:"),
            );
            if (mintMessages.length > 0 && metadataMessages.length > 0) {
              const metadata = parseMetadata(metadataMessages[0]);
              console.log(metadata);
              console.log(metadata);
              console.log(metadata);
              const mintMessageChunks = mintMessages[0]?.split(" ");
              const logObject = {
                ...metadata,
                mintAddress:
                  mintMessageChunks[mintMessageChunks.length - 1].trim(),
              };
              allLogs.push(logObject);
            }
          }
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      }

      return allLogs;
    };

    const getTokenAccountBalance = async (walletAddress, mintAddress) => {
      console.log({ mintAddress, walletAddress });

      try {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          new PublicKey(mintAddress),
          new PublicKey(walletAddress),
        );
        const accountInfo = await connection.getParsedAccountInfo(
          associatedTokenAddress,
        );

        console.log({ accountInfo });
        console.log({ accountInfo });
        console.log({ accountInfo });
        console.log({ accountInfo });
        if (
          accountInfo.value &&
          accountInfo.value.data.parsed &&
          accountInfo.value.data.program === "spl-token"
        ) {
          const tokenAmount =
            accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
          return tokenAmount;
        }
      } catch (error) {
        console.error(`Error fetching account info:`, error);
      }
      return 0;
    };

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);

      try {
        const contractAddress =
          env.NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS;
        let allLogs = await getContractLogs(contractAddress);
        console.log({ allLogs });
        const balancesPromises = allLogs.map((log) =>
          getTokenAccountBalance(walletAddress, log.mintAddress),
        );
        const balances = await Promise.all(balancesPromises);
        let balancesWithMetadata = allLogs.map((log, index) => ({
          ...log,
          balance: balances[index],
        }));
        console.log({ balancesWithMetadata });
        console.log({ balancesWithMetadata });
        console.log({ balancesWithMetadata });
        balancesWithMetadata = balancesWithMetadata.filter(
          (item) => item.balance,
        );

        setBalances(balancesWithMetadata as unknown as FileDetails[]);
      } catch (err) {
        console.error("Failed to fetch token balances:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchBalances();
    }
  }, [walletAddress]);

  return { loading, balances, error };
};

export default useTokenBalances;
