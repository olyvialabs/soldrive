import bs58 from "bs58";
import crypto from "crypto";
import nacl from "tweetnacl";
import { toast } from "sonner";
import { UNIQUE_USER_SIGNATURE_MSG_V1 } from "../constants";
import { PrivateKey } from "eciesjs";

const useGetAuthenticatedWalletKeys = () => {
  const generateUniqueCredentials = async () => {
    const provider = window.solana;
    if (!provider) {
      toast("Solana Provider was not found :(", {
        description: "Please try installing solana before continuing",
        position: "top-center",
      });
    }

    const encodedMessage = new TextEncoder().encode(
      UNIQUE_USER_SIGNATURE_MSG_V1,
    );

    // Request signature from the user
    const signedMessage = await provider.signMessage(encodedMessage);
    const seed = crypto
      .createHash("sha256")
      .update(signedMessage.signature)
      .digest()
      .slice(0, 32);
    const privateKey = new PrivateKey(seed);

    // const keyPair = nacl.sign.keyPair.fromSeed(seed);
    // const publicKeyString = bs58.encode(keyPair.publicKey);
    // const privateKeyString = bs58.encode(keyPair.secretKey);
    if (!privateKey.publicKey.toHex()) {
      toast("There was an issue getting user credentials", {
        description: "Try again later or contact support",
        position: "top-center",
      });
    }
    return {
      publicKeyString: privateKey.publicKey.toHex(),
      privateKeyString: privateKey.toHex(),
      signature: signedMessage.signature,
    };
  };
  return { generateUniqueCredentials };
};

export default useGetAuthenticatedWalletKeys;
