"use client";

import { useState } from "react";
import { GlobalDnD } from "./GlobalDnD";
import { Input } from "~/components/ui/input";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { encrypt, decrypt, getPublic } from "ecies-geth";
import { Button } from "~/components/ui/button";
import crypto from "crypto";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";

const projectId = "2IInhOpJffZRxaPQqK3j97jWqHb";
const projectSecret = "e8624fdd9dddbe74c18be3d9c84ade1b";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: { authorization: auth },
});

const FileTestContent = () => {
  const [inputKey, setInputKey] = useState("SomeRandomKey");
  const [cid, setCid] = useState("");
  const [fileContent, setFileContent] = useState("");

  async function stringTo32ByteKey() {
    const hash = crypto.createHash("sha256");
    // hash.update(inputKey);
    const message = `soldrive.app wants you to sign in with your Solana account:
solana:mainnet:FYpB58cLw5cwiN763ayB2sFT8HLF2MRUBbbyRgHYiRpK

Click Sign or Approve only means you have proved this wallet is owned by you.

URI: https://soldrive.app
Version: 1
Chain ID: solana:mainnet
Nonce: bZQJ0SL6gJ
Issued At: 2022-10-25T16:52:02.748Z
Resources:
- https://foo.com
- https://bar.com`;

    const provider = window.phantom?.solana;
    if (!provider) {
      alert("You need a solana wallet");
      return;
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    const theSignedMsg = new TextDecoder().decode(signedMessage.signature);
    console.log({ theSignedMsg });
    hash.update(theSignedMsg);
    const hashedMessage = hash.digest();

    // guarda signature key a un lado
    //

    // // Truncate the hash to 32 bytes
    // const privateKey = hashedMessage.slice(0, 32);

    return hashedMessage;
  }

  const handleNewFileUpload = async (data) => {
    console.log({ data });
    // Important! The key MUST be 32 byte long
    const privateKey = await stringTo32ByteKey();

    const publicKey = await getPublic(privateKey);

    encrypt(publicKey, Buffer.from(data)).then(async (encrypted) => {
      const added = await ipfs.add(encrypted);
      setCid(added.cid.toString());
    });
  };

  const handleDecryptCID = async () => {
    if (!cid) {
      console.error("No CID available for decryption.");
      return;
    }

    try {
      const chunks = [];
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      const ipfsFileContent = Buffer.concat(chunks);
      const privateKey = await stringTo32ByteKey();
      decrypt(privateKey, ipfsFileContent).then(function (plaintext) {
        setFileContent(plaintext.toString());
      });
    } catch (error) {
      console.error("Error retrieving file content:", error);
      throw error;
    }
  };

  return (
    <AllSolanaContent>
      <div>
        <GlobalDnD onFileRead={handleNewFileUpload} />
        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <label className="text-2xl">
            Current CID:{" "}
            {cid ? (
              <a
                target="_blank"
                className="text-purple-500 hover:underline"
                href={`https://ipfs.io/ipfs/${cid}`}
              >
                {cid}
              </a>
            ) : (
              "No file uploaded yet"
            )}
          </label>
          <label className="mt-28 text-2xl">The Key to encrypt file</label>
          <Input
            placeholder="The key to encrypt"
            className=" w-1/2 rounded-full text-xl"
            onChange={(e) => setInputKey(e.target.value)}
            value={inputKey}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewFileUpload("test");
              }
            }}
          />
          <Button
            disabled={!cid}
            onClick={handleDecryptCID}
            className="mt-28 w-full p-8 text-2xl text-white"
          >
            Decrypt CID
          </Button>
          File content: {fileContent}
        </div>
      </div>
    </AllSolanaContent>
  );
};

export { FileTestContent };
