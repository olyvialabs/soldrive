import ipfsClient from "../FileUpload/components/utils/IpfsConfiguration";
import { decrypt as eciesDecrypt } from "eciesjs";

const decryptIpfsFile = async (
  cid: string,
  privateKeyUserDid: string,
  isPublicFile?: boolean,
) => {
  const fileToDecryptChunks = [];
  for await (const chunk of ipfsClient.cat(cid)) {
    fileToDecryptChunks.push(chunk);
  }
  // Decode the private key string
  // const privateKey = bs58.decode(privateKeyUserDid!).slice(0, 32);
  // Use the first 32 bytes of the private key as the shared secret
  // const publicKey = bs58.decode(publicKeyUserDid!).slice(0, 32);
  const fileFromIpfs = Buffer.concat(fileToDecryptChunks);

  return isPublicFile
    ? fileFromIpfs
    : eciesDecrypt(privateKeyUserDid, fileFromIpfs);
};

export { decryptIpfsFile };
