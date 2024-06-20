"use client";
import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "~/components/ui/menubar";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import {
  Cross1Icon,
  DotsVerticalIcon,
  DownloadIcon,
  InfoCircledIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { Badge } from "~/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import useDownloadFiles from "../hooks/useDownloadFiles";
import { FileSharingDialog } from "./FileSharingDialog";

export function FileSelectionControls() {
  const { fileSelection, clearFileSelection, setPreviewFileDetails } =
    useFilesStore();
  const [isShareDialogVisible, setIsShareDialogVisible] = useState(false);
  const wallet = useWallet();
  const { downloadFiles } = useDownloadFiles();
  const multipleFilesSelected = fileSelection.filesSelected.length > 1;

  return (
    <>
      <FileSharingDialog
        open={isShareDialogVisible}
        onOpenChange={setIsShareDialogVisible} 
      />
      <Menubar onClick={(e) => e.stopPropagation()}>
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            onClick={clearFileSelection}
          >
            <Cross1Icon />
          </MenubarTrigger>
        </MenubarMenu>
        <Badge className="text-sm md:px-4" variant="outline">
          {fileSelection.filesSelected.length} selected
        </Badge>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">
            <Share2Icon
              className="mr-"
              onClick={() => {
                setIsShareDialogVisible(true);
              }}
            />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            onClick={async () => {
              await downloadFiles();
            }}
          >
            <DownloadIcon className="mr-" />
          </MenubarTrigger>
        </MenubarMenu>
        {/* <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          <TrashIcon className="mr-" />
        </MenubarTrigger>
      </MenubarMenu> */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">
            <DotsVerticalIcon className="h-4 w-4" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              //disabled={multipleFilesSelected}
              onClick={() => {
                setIsShareDialogVisible(true);
              }}
            >
              <Share2Icon className="mr-2" />
              Share
            </MenubarItem>
            <MenubarItem
              onClick={async () => {
                await downloadFiles();
              }}
            >
              <DownloadIcon className="mr-2" />
              Download
            </MenubarItem>
            {/* <MenubarItem>
            <CopyIcon className="mr-2" />
            Make Copy
          </MenubarItem> */}
            {/* <MenubarItem className="text-red-500">
            <TrashIcon className="mr-2" />
            Remove
          </MenubarItem> */}
            <MenubarItem
              disabled={multipleFilesSelected}
              onClick={() => {
                // if this enters, it means it's not disabled, which meant's
                // there's only one file selected
                setPreviewFileDetails({
                  fileId: fileSelection.filesSelected[0],
                  isVisible: true,
                });
              }}
            >
              <InfoCircledIcon className="mr-2" />
              File Information
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}
