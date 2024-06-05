"use client";

import { useState } from "react";
import { GlobalDnD } from "./GlobalDnD";
import { Input } from "~/components/ui/input";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { encrypt, decrypt, getPublic } from "ecies-geth";
import { Button } from "~/components/ui/button";
import crypto from "crypto";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";

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

const message = "Sign this message to generate your DID.";

const DidGenerator = ({
  onChangeDid,
}: {
  onChangeDid: (did: string) => void;
}) => {
  const [didDocumentCid, setDidDocumentCid] = useState("");

  const connectWalletAndGetSignature = async () => {
    try {
      // Check if Phantom is available
      if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          // Prompt user to connect their wallet if not already connected
          await provider.connect();
          const publicKey = provider.publicKey.toString();
          const encodedMessage = new TextEncoder().encode(message);

          // Request signature from the user
          const signedMessage = await provider.signMessage(
            encodedMessage,
            "utf8",
          );

          // Fake username for demonstration purposes
          const username = "THE_TEST_USERNAME";

          // Construct DID document
          const didDocument = {
            username: username,
            walletPublicKey: publicKey,
            // You can add additional information here as needed
          };

          // Save the DID document on IPFS
          const { cid } = await ipfs.add(JSON.stringify(didDocument));
          setDidDocumentCid(cid.toString());
          onChangeDid(cid.toString());
        } else {
          alert("Phantom wallet not found!");
        }
      }
    } catch (error) {
      console.error("Failed to connect to wallet or get signature:", error);
    }
  };

  return (
    <div>
      <h1>STEP 1: GENERATE DID</h1>
      <Button
        onClick={connectWalletAndGetSignature}
        className=" p-8 text-2xl text-white"
      >
        Generate DID Document
      </Button>
      {didDocumentCid && <div>DID Document CID: {didDocumentCid}</div>}
    </div>
  );
};

const FileTestContent = () => {
  const [cid, setCid] = useState("");
  const [didDocumentCid, setDidDocumentCid] = useState("");
  const [fileContent, setFileContent] = useState("");

  // const generateDid = async () => {
  //   const seedBuffer = await stringTo32ByteKey();
  //   const seed = new Uint8Array(seedBuffer?.buffer!);
  //   const provider = new Ed25519Provider(seed);
  //   const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  //   await did.authenticate();
  //   setUserDID(did.id);

  // };

  async function stringTo32ByteKey() {
    const hash = crypto.createHash("sha256");
    // hash.update(inputKey);
    const provider = window.phantom?.solana;
    if (!provider) {
      alert("You need a solana wallet");
      return;
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    const theSignedMsg = new TextDecoder().decode(signedMessage.signature);
    hash.update(theSignedMsg);
    const hashedMessage = hash.digest();

    // guarda signature key a un lado
    //

    // // Truncate the hash to 32 bytes
    // const privateKey = hashedMessage.slice(0, 32);

    return hashedMessage;
  }

  const handleNewFileUpload = async (data) => {
    return;
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
      console.error("No CID available for decrypti on.");
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
        <DidGenerator onChangeDid={setDidDocumentCid} />
        <h1 className="mt-28">STEP 2: UPLOAD FILE</h1>
        <GlobalDnD onFileRead={handleNewFileUpload} />
        <div className="mt-4 flex w-full flex-col">
          <label className="text-2xl">
            Current upload CID:{" "}
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
          <h1 className="mt-28">STEP 3: Decrypt</h1>
          <Button
            disabled={!cid}
            onClick={handleDecryptCID}
            className=" p-8 text-2xl text-white"
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
