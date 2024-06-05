import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import { FileDetails } from "../../FileDisplayer/types";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";

const isMobile = () => window.innerWidth <= 768;

const FileDetailsInnerContent = () => {
  const { previewFileDetails } = useFilesStore();
  const { files: filesData } = useUserFilesStore();
  const fileContent = (filesData || []).find(
    (item) => item.id === previewFileDetails.fileId,
  );

  if (!fileContent) {
    return null;
  }
  // Convert file size from bytes to MB with 1 decimal place
  const fileSizeInMB = fileContent
    ? `${(fileContent.weight / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return (
    <div className="grid gap-1 border-t p-4 text-sm">
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Name</span>
        <span>{fileContent.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Type</span>
        <span>{fileContent.typ === "folder" ? "Folder" : "File"}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Location</span>
        <span>
          {fileContent.file_parent_id ? "Has parent folder" : "Root folder"}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Owner</span>
        <span>You</span> {/* Assuming the current user is always the owner */}
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Sharing</span>
        <span>Private</span>{" "}
        {/* This might need to be dynamic based on your application's logic */}
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Access</span>
        <span>Only you can access</span>{" "}
        {/* Adjust based on application's sharing/access logic */}
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Added</span>
        <span>{/* Date added not provided in FileDetails */}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Size</span>
        <span>{fileSizeInMB}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-16 text-gray-500">Modified</span>
        <span>{/* Modified date not provided in FileDetails */}</span>
      </div>
    </div>
  );
};

export function PreviewFileDetails() {
  const { previewFileDetails } = useFilesStore();
  const { setPreviewFileDetails } = useFilesStore();
  if (!previewFileDetails.isVisible) {
    return null;
  }

  if (!isMobile()) {
    return (
      <div className="w-[300px] transition-all duration-300 ease-in-out">
        <div className="rounded-t-lg">
          <div className="space-between flex w-full flex-row items-center space-x-2 px-2">
            <h2 className="text-lg font-medium">Details</h2>
            <Button
              onClick={() => {
                setPreviewFileDetails({ isVisible: false, fileId: "" });
              }}
              className="h-6 w-6 rounded-lg"
              size="icon"
              variant="ghost"
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        <FileDetailsInnerContent />
      </div>
    );
  }

  return (
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
        </DrawerHeader>
        <div>
          <FileDetailsInnerContent />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
