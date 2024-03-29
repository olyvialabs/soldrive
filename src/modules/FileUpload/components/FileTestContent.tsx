"use client";

import { useState } from "react";
import { GlobalDnD } from "./GlobalDnD";
import { Input } from "~/components/ui/input";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { encrypt, decrypt, getPublic } from "ecies-geth";
import { Button } from "~/components/ui/button";
import crypto from "crypto";

const projectId = "";
const projectSecret = "";
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

  function stringTo32ByteKey() {
    const hash = crypto.createHash("sha256");
    hash.update(inputKey);

    return hash.digest();
  }

  const handleNewFileUpload = async (data) => {
    console.log({ data });
    // Important! The key MUST be 32 byte long
    const privateKey = stringTo32ByteKey();
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
      const privateKey = stringTo32ByteKey();
      console.log({ privateKey });
      decrypt(privateKey, ipfsFileContent).then(function (plaintext) {
        setFileContent(plaintext.toString());
      });
    } catch (error) {
      console.error("Error retrieving file content:", error);
      throw error;
    }
  };

  return (
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
  );
};

export { FileTestContent };
