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
import { useCallback, useState } from "react";
import { CommandLoading } from "cmdk";
import { Skeleton } from "~/components/ui/skeleton";
import _ from "lodash";
import { UserInformationData } from "~/modules/Store/Auth/store";
import { PersonIcon } from "@radix-ui/react-icons";
export function UsernameSearchInput({
  currentUser,
  setCurrentUser,
}: {
  currentUser: UserInformationData | null;
  setCurrentUser: (data: UserInformationData | null) => void;
}) {
  const [currentDisplayItems, setCurrentDisplayItems] = useState<
    UserInformationData[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { searchUsernames } = useContractIndexer();
  const search = (value: string) => {
    setLoading(true);
    searchUsernames({ username: value, limit: 6 })
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
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="flex cursor-pointer flex-row items-center space-x-2 space-y-1.5 rounded-lg border p-4 hover:bg-accent"
      >
        <PersonIcon />
        <div className="flex w-full flex-1 flex-col">
          <span className="break-all text-base font-semibold tracking-tight">
            Destination
          </span>

          {currentUser?.username && (
            <span className="break-all">
              For <b className="text-purple-500">{currentUser?.username}</b>{" "}
              with wallet {currentUser?.user_solana}
            </span>
          )}
          <p className="break-all  text-sm text-muted-foreground">
            {currentUser?.username
              ? "Click here to modify"
              : "Click here and write the username"}
          </p>
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
        <CommandList>
          {loading && <CommandLoading>Loading users...</CommandLoading>}
          <CommandEmpty>
            {!input
              ? "Try searching, users will be listed here"
              : "No results found."}
          </CommandEmpty>
          {currentDisplayItems.map((item) => {
            return (
              <CommandItem
                onSelect={() => {
                  setCurrentUser(item);
                  setOpen(false);
                }}
                value={item.username}
              >
                <div
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setCurrentUser(item);
                    setOpen(false);
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
