import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import useContractIndexer from "../../hooks/useContractIndexer";
import { useCallback, useRef, useState } from "react";
import { CommandLoading } from "cmdk";
import { Skeleton } from "~/components/ui/skeleton";
import _ from "lodash";
import { UserInformationData } from "~/modules/Store/Auth/store";
import { GlobeIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatWalletAddress } from "~/modules/User/utils";
export function UsernameSearchInput({
  currentUser,
  isPublicSelected,
  setIsPublicSelected,
  setCurrentUser,
  forView,
}: {
  currentUser: UserInformationData | null;
  forView: any;
  setCurrentUser: (data: UserInformationData | null) => void;
  isPublicSelected: boolean;
  setIsPublicSelected: (data: any) => void;
}) {
  const [currentDisplayItems, setCurrentDisplayItems] = useState<
    UserInformationData[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { searchUsernames } = useContractIndexer();
  const signalReference = useRef(new AbortController());
  const search = (value: string) => {
    setLoading(true);

    // if (signalReference.current.signal) {
    //   const abort = new AbortController();
    //   signalReference.current.abort();
    // }
    searchUsernames({
      username: value,
      limit: 6,
      abortSignal: signalReference.current.signal,
    })
      .then((result) => {
        console.log(result);
        console.log(result);
        setCurrentDisplayItems(result?.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const debouncedFunction = useCallback(_.debounce(search, 400), []);

  return (
    <>
      <div>
        <div
          className={cn(
            " gap-0.5",
            forView === "dialog" ? "w-full" : "grid grid-cols-2",
          )}
        >
          <div
            onClick={(e) => {
              // if (forView === "dialog") {
              //   e.preventDefault();
              //   e.stopPropagation();
              // }
              setOpen(true);
            }}
            className={cn(
              "flex cursor-pointer flex-row items-center space-x-2 space-y-1.5 rounded-lg border p-2 hover:bg-accent",
              !!currentUser?.username
                ? "bg-purple-700 hover:bg-purple-800"
                : "",
            )}
          >
            <div className="flex w-full flex-1 flex-col">
              <span className="break-all text-lg font-semibold tracking-tight">
                <PersonIcon className="mb-2" />
                To User
              </span>

              {currentUser?.username && (
                <span className="break-all">
                  To <b className="text-black">{currentUser?.username}</b> with
                  wallet {formatWalletAddress(currentUser?.user_solana)}
                </span>
              )}
              <p className="break-word  text-sm text-muted-foreground">
                {currentUser?.username
                  ? "Click here to modify"
                  : "Find by username"}
              </p>
            </div>
          </div>
          {forView !== "dialog" && (
            <div
              onClick={(e) => {
                if (forView === "dialog") {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setIsPublicSelected(true);
                setCurrentUser(null);
              }}
              className={cn(
                "flex cursor-pointer flex-row items-center space-x-2 space-y-1.5 rounded-lg border p-2 hover:bg-accent",
                isPublicSelected ? "bg-purple-700 hover:bg-purple-800" : "",
              )}
            >
              <div className="flex w-full flex-1 flex-col">
                <span className="break-all text-lg font-semibold tracking-tight">
                  <GlobeIcon className="mb-2" />
                  Public
                </span>

                <p className="break-word  text-sm text-muted-foreground">
                  Anyone with link
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={input}
          placeholder="Search for a username..."
          onChangeCapture={(e) => {
            setInput(e.target.value);
            debouncedFunction(e.target.value);
          }}
        />
        <CommandList style={{ zIndex: 999999 }}>
          {loading && (
            <CommandLoading>
              <CommandEmpty>Loading users...</CommandEmpty>
            </CommandLoading>
          )}
          {!loading && (
            <CommandEmpty>
              {!input
                ? "Try searching, users will be listed here"
                : "No results found. "}
            </CommandEmpty>
          )}
          {currentDisplayItems.map((item, index) => {
            return (
              <CommandItem
                onSelect={(e) => {
                  setCurrentUser(item);
                  setOpen(false);
                  setIsPublicSelected(false);
                }}
                disabled={false}
                aria-disabled={false}
                key={`${index}-${item.did_public_address}`}
                value={item.username}
                className="cursor-pointer"
              >
                <div
                  className="flex w-full cursor-pointer flex-row"
                  onClick={() => {
                    setCurrentUser(item);
                    setOpen(false);
                    setIsPublicSelected(false);
                  }}
                >
                  <PersonIcon className="mr-1" />
                  <span>
                    <b>{item.username}</b> {item.user_solana}
                  </span>
                </div>
              </CommandItem>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
