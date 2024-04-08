import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { env } from "../../../env";
// Setup the connection to use the Alchemy RPC endpoint
const alchemyEndpoint =
  "https://solana-devnet.g.alchemy.com/v2/zEDWpOFCLIVzNr7iqfQmypknGRQSV0jX";
const connection = new Connection(alchemyEndpoint, "confirmed");

interface Metadata {
  "UserMetadata user_solana": string;
  did_public_address: string;
}
const useGetAllUserData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const parseMetadata = (metadataString: string): Metadata => {
    const metadata: Metadata = {};
    const parts = metadataString
      .replace("Program log: Deserialized metadata: ", "")
      .replace(" }", "")
      .replace("{ ", "")
      .split(", ");

    parts.forEach((part) => {
      const [key, value] = part.split(": ");
      metadata[key.trim()] = value.replace(/"/g, "").trim();
    });

    return metadata;
  };

  const getContractLogs = async (contractAddress: string) => {
    console.log({ contractAddress });
    const publicKey = new PublicKey(contractAddress);
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 100,
    });
    const allMetadataLogs: Metadata[] = [];
    console.log({ signatures });

    for (let signatureInfo of signatures) {
      try {
        const transaction = await connection.getTransaction(
          signatureInfo.signature,
          { commitment: "confirmed" },
        );
        console.log({ transaction });
        console.log({ transaction });
        if (transaction && transaction.meta && transaction.meta.logMessages) {
          const metadataMessages = transaction.meta.logMessages.filter((log) =>
            log.startsWith("Program log: Deserialized metadata:"),
          );
          metadataMessages.forEach((metadataLog) => {
            const metadata = parseMetadata(metadataLog);
            allMetadataLogs.push(metadata);
          });
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    }

    setData(allMetadataLogs);
    console.log({ allMetadataLogs });
    console.log({ allMetadataLogs });
    //setLogs(allMetadataLogs);
    setLoading(false);
  };

  useEffect(() => {
    getContractLogs(env.NEXT_PUBLIC_USERS_CONTRACT_ADDRESS);
  }, []);
  return { loading, data };
};

export default useGetAllUserData;
