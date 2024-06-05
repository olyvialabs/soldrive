import * as React from "react";
import { FilePlusIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { NewFolderDialog } from "../../FileUpload/components/NewFolderDialog";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";

export function AddNewFileButton() {
  const [popoverIsOpened, setPopoverIsOpened] = React.useState(false);
  const [newFolderDialogIsOpened, setNewFolderDialogIsOpened] =
    React.useState(false);
  const { changeForcedUploadFiles } = useFilesStore();

  return (
    <Popover open={popoverIsOpened} onOpenChange={setPopoverIsOpened}>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 text-white"
          size="lg"
          role="combobox"
          aria-expanded={popoverIsOpened}
        >
          <FilePlusIcon className="mr-2" />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <NewFolderDialog
          newFolderDialogIsOpened={newFolderDialogIsOpened}
          onClose={() => {
            setNewFolderDialogIsOpened(false);
          }}
          onComplete={() => {
            setNewFolderDialogIsOpened(false);
            setPopoverIsOpened(false);
          }}
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setNewFolderDialogIsOpened(true);
            }}
          >
            <FilePlusIcon className="mr-1" /> Create Folder
          </Button>
        </NewFolderDialog>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setPopoverIsOpened(false);
            changeForcedUploadFiles(true);
          }}
        >
          <FilePlusIcon className="mr-1" />
          New File
        </Button>
      </PopoverContent>
    </Popover>
  );
}
