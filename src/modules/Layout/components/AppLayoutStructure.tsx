import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const AppLayoutStructure = ({ children }: { children: React.ReactNode }) => {
  // const wallet = useWallet();

  // if(!wallet.connected) {

  //}

  return children;
};

export default AppLayoutStructure;
