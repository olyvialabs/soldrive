import {
  CopyIcon,
  DownloadIcon,
  InfoCircledIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import useDownloadFiles from "../hooks/useDownloadFiles";
import { useState } from "react";
import { FileSharingDialog } from "./FileSharingDialog";

export function FilePreviewItemContextMenu({
  children,
  file_id,
  onOpenChange,
  allFiles,
}: {
  children: React.ReactNode;
  file_id: string;
  allFiles: any;
  onOpenChange?: (open: boolean) => void;
}) {
  const { fileSelection, setPreviewFileDetails } = useFilesStore();
  const [isShareDialogVisible, setIsShareDialogVisible] = useState(false);
  const { downloadFiles } = useDownloadFiles();

  return (
    <>
      <FileSharingDialog
        open={isShareDialogVisible}
        onOpenChange={setIsShareDialogVisible}
      />
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            inset
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShareDialogVisible(true);
            }}
          >
            <Share2Icon className="mr-2" /> Share
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await downloadFiles();
            }}
          >
            <DownloadIcon className="mr-2" /> Download
          </ContextMenuItem>
          {/* <ContextMenuItem inset>
          <CopyIcon className="mr-2" /> Make a copy
        </ContextMenuItem> */}
          <ContextMenuItem
            inset
            onClick={(e) => {
              // if this enters, it means it's not disabled, which meant's
              // there's only one file selected
              setPreviewFileDetails({
                fileId: file_id || fileSelection.filesSelected[0],
                isVisible: true,
              });
            }}
          >
            <InfoCircledIcon className="mr-2" /> File information
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
