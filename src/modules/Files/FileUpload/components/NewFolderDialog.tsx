import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import FileUploadButton from "./FileUploadButton";

export function NewFolderDialog({
  children,
  newFolderDialogIsOpened,
  onClose,
  onComplete,
}: {
  children: React.ReactNode;
  newFolderDialogIsOpened: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [folderName, setFolderName] = useState("");

  return (
    <Dialog
      open={newFolderDialogIsOpened}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>Give a name to your new folder</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <FileUploadButton folderName={folderName} onComplete={onComplete} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
