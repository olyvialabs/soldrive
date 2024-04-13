import { useState, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
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
        limit: 100,
      });
      const allLogs = [];

      for (let signatureInfo of signatures) {
        try {
          const transaction = await connection.getTransaction(
            signatureInfo.signature,
            { commitment: "confirmed" },
          );
          console.log({ testing: "true", transaction });
          console.log({ testing: "true", transaction });
          console.log({ testing: "true", transaction });
          console.log({ testing: "true", transaction });
          if (transaction && transaction.meta && transaction.meta.logMessages) {
            // Find specific log messages
            const metadataMessages = transaction.meta.logMessages.filter(
              (log) => log.startsWith("Program log: Deserialized metadata:"),
            );
            // Only add if both types of messages exist
            if (metadataMessages.length > 0) {
              const metadata = parseMetadata(metadataMessages[0]);
              console.log({ testing: "true", metadata });
              console.log({ testing: "true", metadata });
              console.log({ testing: "true", metadata });
              const logObject = {
                ...metadata,
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

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);

      try {
        const contractAddress =
          env.NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS;
        let allLogs = await getContractLogs(contractAddress);

        let balancesWithMetadata = allLogs.filter(
          (item) => item.to === walletAddress,
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
