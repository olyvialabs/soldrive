import { GridIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import { Toggle } from "~/components/ui/toggle";
import { FileSelectionControls } from "./FileSelectionControls";
import { FileDetails } from "../types";

const FileDisplayView = () => {
  const { controls, changeDisplayControls } = useFilesStore();

  return (
    <div className="flex flex-row gap-2">
      <Toggle
        aria-label="Toggle Grid"
        pressed={controls.view === "grid"}
        onClick={() => {
          changeDisplayControls({ view: "grid" });
        }}
      >
        <GridIcon className="h-6 w-6" />
      </Toggle>
      <Toggle
        aria-label="Toggle List"
        onClick={() => {
          changeDisplayControls({ view: "list" });
        }}
        pressed={controls.view === "list"}
      >
        <ListBulletIcon className="h-6 w-6" />
      </Toggle>
    </div>
  );
};
const FileDisplayControls = () => {
  const { fileSelection } = useFilesStore();
  if (fileSelection.filesSelected.length > 0) {
    return <FileSelectionControls />;
  }

  return (
    <div className="mb-4 flex justify-between">
      <div>{/* <GlobalDnD /> */}</div>
      <FileDisplayView />
    </div>
  );
};

export default FileDisplayControls;
