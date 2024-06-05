"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TimerIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAuthStore } from "../../Store/Auth/store";

const ProcessLoginToken = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true);
  const { setAuthUserInfo } = useAuthStore();
  const checkToken = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/validate-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data, status } = await response.json();
      setAuthUserInfo(data);
      if (status !== 200) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      const errorMsg = error?.message || error;
      toast("Error validating magic link", { description: errorMsg });
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (token) {
      checkToken();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg rounded-md bg-gray-800 px-8 py-4">
        <h2 className="flex flex-col items-center space-x-1 text-4xl font-semibold">
          <TimerIcon className="h-12 w-12 flex-shrink-0 text-yellow-600" />
          <span>Loading...</span>
        </h2>
        <p className="mt-3 text-center text-lg">Validating your information.</p>
      </div>
    );
  }
  return <></>;
};

const LoginContent = () => {
  const params = useSearchParams();
  const token = params.get("token");
  if (token) {
    return <ProcessLoginToken token={token} />;
  }

  return (
    <>
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[white] to-primary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link href="/get-access">
              <Button
                variant="link"
                className="ml-1 p-0 font-semibold leading-6 text-primary"
              >
                Get Access!
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginContent;
