import * as React from "react";
import { FilePlusIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { NewFolderDialog } from "../../FileUpload/components/NewFolderDialog";
import { useFilesStore } from "../../store/store";

export function AddNewFileButton() {
  const [open, setOpen] = React.useState(false);
  const { changeForcedUploadFiles } = useFilesStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 text-white"
          size="lg"
          role="combobox"
          aria-expanded={open}
        >
          <FilePlusIcon className="mr-2" />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <NewFolderDialog>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              //setOpen(false);
            }}
          >
            <FilePlusIcon className="mr-1" /> Create Folder
          </Button>
        </NewFolderDialog>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setOpen(false);
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
