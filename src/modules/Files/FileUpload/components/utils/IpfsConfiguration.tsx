import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = "2IInhOpJffZRxaPQqK3j97jWqHb";
const projectSecret = "e8624fdd9dddbe74c18be3d9c84ade1b";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfsClient = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: { authorization: auth },
});

export default ipfsClient;
