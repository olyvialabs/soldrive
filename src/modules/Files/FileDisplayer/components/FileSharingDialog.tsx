import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import SoldriveTransferInnerContent from "../../Transfer/components/SoldriveTransferInnerContent";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";

export function FileSharingDialog({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (newValue: any) => void;
  onComplete: () => void;
}) {
  const { fileSelection } = useFilesStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[50vh]">
        <DialogHeader>Sharing now</DialogHeader>
        {fileSelection.filesSelected.length > 1 && (
          <span>
            You are about to share {fileSelection.filesSelected.length} files
          </span>
        )}
        <SoldriveTransferInnerContent
          forView="dialog"
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
