"use client";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { db } from "./firebaseConfig";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { collection, addDoc } from "firebase/firestore";

const WaitlistContent = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!walletAddress) {
      toast("Please enter a wallet address.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "walletAddresses"), {
        walletAddress: walletAddress,
        // You can add more fields here if needed
      });
      toast("✨ Wallet address added to the waitlist!", {
        position: "top-center",
        duration: 4000,
      });
      setWalletAddress("");
    } catch (error) {
      console.error("Error inserting wallet address:", error);
      toast("An error occurred while adding to the waitlist.");
    }
    setLoading(false);
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <img src="/assets/images/logo-soldrive.png" className="h-24" />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Join the Waitlist
        </h1>
        <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Be the first to know when we launch. Exclusive access, sneak peeks,
          and more.
        </p>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          id="wallet"
          readOnly={loading}
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Wallet"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        {walletAddress.length > 0 && (
          <Button
            className="w-full text-white"
            onClick={handleSubmit}
            loading={loading}
          >
            Join the waitlist
          </Button>
        )}
      </div>
    </div>
  );
};

export { WaitlistContent };
