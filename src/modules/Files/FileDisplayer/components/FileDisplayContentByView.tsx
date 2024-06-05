"use client";

import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import FilePreviewContentItem from "./FilePreviewContentItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { FileIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { EmptyPlaceholder } from "./FileDisplayNoItems";
import { AddNewFileButton } from "./AddNewFileButton";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";

const FileDisplayContentByView = () => {
  const { controls, currentFolderInformation } = useFilesStore();
  const { files: filesData } = useUserFilesStore();

  const filteredFiles = useMemo(() => {
    if (!currentFolderInformation.fileData?.id) {
      return filesData.filter(
        (item) =>
          item.file_parent_id === "" ||
          item.file_parent_id === null ||
          item.file_parent_id === undefined,
      );
    }

    return filesData.filter(
      (item) => item.file_parent_id === currentFolderInformation.fileData?.id,
    );
  }, [filesData, currentFolderInformation.fileData?.id]);

  if (!filteredFiles.length) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon>
          <FileIcon className="h-4 w-4" />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>Nothing added yet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Please start by adding files via drag and drop or clicking the button
          below
        </EmptyPlaceholder.Description>
        <AddNewFileButton />
      </EmptyPlaceholder>
    );
  }

  if (controls.view === "list") {
    return (
      <div className="mt-4 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50vw]">Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((item) => (
              <FilePreviewContentItem
                key={`file-item-${item.id}`}
                item={item}
                allFiles={filesData}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredFiles.map((item) => (
        <FilePreviewContentItem
          key={`file-item-${item.id}`}
          item={item}
          allFiles={filesData}
        />
      ))}
    </div>
  );
};

export default FileDisplayContentByView;
