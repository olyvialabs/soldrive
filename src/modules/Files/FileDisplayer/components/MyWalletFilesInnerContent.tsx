"use client";

import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import FileDisplayControls from "./FileDisplayControls";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useGlobalDragAndDrop from "../../FileUpload/hooks/useGlobalDragAndDrop";
import { GlobalDnD } from "../../FileUpload/components/GlobalDnD";
import { Button } from "~/components/ui/button";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import FileDisplayContentByView from "./FileDisplayContentByView";

const MyWalletFilesInnerContent = () => {
  const {
    fileSelection,
    forcedUploadFiles,
    clearFileSelection,
    changeForcedUploadFiles,
    currentFolderInformation,
    setCurrentFolderInformation,
  } = useFilesStore();
  const { isDragging } = useGlobalDragAndDrop();
  const { files: walletFiles } = useUserFilesStore();

  return (
    <div
      onClick={() => {
        if (fileSelection.filesSelected.length) {
          clearFileSelection();
        }
      }}
      className="mx-auto flex w-[1280px] max-w-full flex-1"
    >
      <div className="h-full w-full">
        {currentFolderInformation.fileData?.id && (
          <div className="block w-full">
            <div className="flex w-full flex-col items-start">
              <Button
                className="p-0 text-white"
                variant="link"
                onClick={() => {
                  const parentFile = walletFiles.find(
                    (item) =>
                      item.id ===
                      currentFolderInformation.fileData?.file_parent_id,
                  );
                  if (!parentFile) {
                    setCurrentFolderInformation(null);
                    return;
                  }
                  setCurrentFolderInformation(parentFile);
                }}
              >
                <ArrowLeftIcon className="mr-2" /> Back
              </Button>
              <span className="text-lg">
                {currentFolderInformation.fileData?.name}
              </span>
            </div>
          </div>
        )}
        {isDragging || forcedUploadFiles ? (
          <>
            <GlobalDnD />
            {forcedUploadFiles && (
              <Button
                onClick={() => {
                  changeForcedUploadFiles(false);
                }}
                variant="link"
                className="ml-4 px-4"
                size="lg"
              >
                Close file uploader
              </Button>
            )}
          </>
        ) : (
          <>
            <FileDisplayControls />
            <FileDisplayContentByView />
          </>
        )}
      </div>
    </div>
  );
};

export { MyWalletFilesInnerContent };
