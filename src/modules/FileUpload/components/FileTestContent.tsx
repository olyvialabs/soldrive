"use client";

import { useState } from "react";
import { GlobalDnD } from "./GlobalDnD";
import { Input } from "~/components/ui/input";
import { create as ipfsHttpClient } from "ipfs-http-client";
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
  const [inputKey, setInputKey] = useState("");

  const handleNewFileUpload = async (data: string) => {
    console.log({ data });
    const added = await ipfs.add(data);
    console.log({ added });
  };

  return (
    <div>
      <GlobalDnD onFileRead={handleNewFileUpload} />
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <label className="text-2xl">The Key to encrypt file</label>
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
      </div>
    </div>
  );
};

export { FileTestContent };
