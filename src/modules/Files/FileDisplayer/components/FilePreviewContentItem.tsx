import { MouseEvent, memo, useRef } from "react";
import { useFilesStore } from "../../store/store";
import { FilePreviewItemContextMenu } from "./FilePreviewItemContextMenu";
import { Button } from "~/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { FileDetails } from "../types";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { TableCell, TableRow } from "~/components/ui/table";
import {
  audioExtensions,
  documentExtensions,
  imageExtensions,
  sheetsExtensions,
} from "../data/fileExtension";

interface FilePreviewContentItemProps {
  item: FileDetails;
  allFiles: FileDetails[];
}

const FilePreviewContent = memo(({ item }: { item: FileDetails }) => {
  const fileSplitted = (item.name || "").split(".");
  const extension = fileSplitted[fileSplitted.length - 1] || "";
  if (item.typ === "folder") {
    return <img className="h-12 w-12 " src="/folder-icon.png" />;
  }
  if (imageExtensions.includes(extension)) {
    return <img className="h-12 w-12 " src="/image-icon.png" />;
  }
  if (sheetsExtensions.includes(extension)) {
    return <img className="h-12 w-12 " src="/sheet-icon.png" />;
  }
  if (documentExtensions.includes(extension)) {
    return <img className="h-12 w-12 " src="/file-icon.png" />;
  }
  if (audioExtensions.includes(extension)) {
    return <img className="h-12 w-12 " src="/file-icon.png" />;
  }

  return <img className="h-12 w-12 " src="/file-icon.png" />;
});

const OptionsMenu = ({ onClickMenu }: { onClickMenu: () => void }) => {
  return (
    <Button onClick={onClickMenu} className="bg-background p-2" variant="ghost">
      <DotsVerticalIcon className="h-4 w-4 text-white" />
    </Button>
  );
};

const FileRowContextWrapper = ({
  file_id,
  children,
  allFiles,
}: {
  file_id: string;
  children: React.ReactNode;
  allFiles: any;
}) => {
  return (
    <div className="m-0 h-full w-full  p-0">
      <FilePreviewItemContextMenu file_id={file_id} allFiles={allFiles}>
        <div className="p-2">{children}</div>
      </FilePreviewItemContextMenu>
    </div>
  );
};

const FilePreviewInnerContentItem = ({
  item,
  allFiles,
}: FilePreviewContentItemProps) => {
  const { controls, selectFile, fileSelection } = useFilesStore();
  const contextMenuRef = useRef(null);

  const handleClickMenuOptions = () => {
    if (contextMenuRef.current) {
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      contextMenuRef?.current?.dispatchEvent?.(event);
    }
  };

  const handleClickItem = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    // important so it correctly fires the clearFileSelection on parent
    e.stopPropagation();
    const isSelectedWithMultipleSelection = e.altKey;
    selectFile(item.file_id, isSelectedWithMultipleSelection);
  };

  const isItemSelected = fileSelection.filesSelected.includes(item.file_id);

  if (controls.view === "list") {
    return (
      <TableRow
        onClick={handleClickItem}
        className={cn(
          isItemSelected ? "bg-gradient-to-br from-black to-purple-800" : "",
        )}
      >
        <TableCell className="p-0 font-medium">
          <FileRowContextWrapper file_id={item.file_id} allFiles={allFiles}>
            {item.name}
          </FileRowContextWrapper>
        </TableCell>
        <TableCell className="p-0">
          <FileRowContextWrapper file_id={item.file_id} allFiles={allFiles}>
            {item.to}
          </FileRowContextWrapper>
        </TableCell>
        <TableCell className="p-0">
          <FileRowContextWrapper file_id={item.file_id} allFiles={allFiles}>
            {" "}
          </FileRowContextWrapper>
        </TableCell>
        <TableCell className="p-0">
          <FileRowContextWrapper file_id={item.file_id} allFiles={allFiles}>
            <OptionsMenu onClickMenu={handleClickMenuOptions} />
          </FileRowContextWrapper>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <FilePreviewItemContextMenu file_id={item.file_id} allFiles={allFiles}>
      <Card
        ref={contextMenuRef}
        onClick={handleClickItem}
        className={cn(
          "w-full",
          isItemSelected ? "bg-gradient-to-br from-black to-purple-800" : "",
        )}
      >
        <CardHeader className="space-between relative flex w-full flex-row">
          <>
            <p className="w-full flex-1 truncate pr-8 text-sm">
              {item.name || "No name"}
            </p>
          </>
          <div className="absolute right-4 top-2">
            <OptionsMenu onClickMenu={handleClickMenuOptions} />
          </div>
        </CardHeader>
        <CardContent className="px-2 md:px-4">
          <div className="aspect-video">
            <div className="flex h-full w-full items-center justify-center rounded-sm border border-gray-500">
              <FilePreviewContent item={item} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-start justify-between gap-1">
          <Avatar className="mr-1 mt-1 h-4 w-4">
            <AvatarImage src="/default-user-photo.png" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <p className="w-full flex-1 truncate text-sm text-muted-foreground">
            User {item.to}
          </p>
        </CardFooter>
      </Card>
    </FilePreviewItemContextMenu>
  );
};

const FilePreviewContentItem = (props: FilePreviewContentItemProps) => {
  return <FilePreviewInnerContentItem {...props} />;
};

export default memo(FilePreviewContentItem);
