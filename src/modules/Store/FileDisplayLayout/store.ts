import { persist } from "zustand/middleware";
import { create } from "zustand";
import { FileDetails } from "../../Files/FileDisplayer/types";

export enum FilesViewType {
  GRID = "grid",
  LIST = "list",
}
interface FilesStoreControls {
  view: FilesViewType;
}

interface FilesSelection {
  filesSelected: Array<string>;
}

interface PreviewFileDetails {
  isVisible: boolean;
  fileId: string;
  fileContent: FileDetails | null;
}

interface CurrentFolder {
  fileData: FileDetails | null;
}

export interface FilesStore {
  controls: FilesStoreControls;
  fileSelection: FilesSelection;
  currentFolderInformation: CurrentFolder;
  forcedUploadFiles: boolean;
  previewFileDetails: PreviewFileDetails;
  changeDisplayControls: (newControls: Partial<FilesStoreControls>) => void;
  selectFile: (fileId: string, withMultipleSelection: boolean) => void;
  setPreviewFileDetails: (
    newPreviewFileDetails: Partial<PreviewFileDetails>,
  ) => void;
  clearFileSelection: () => void;
  changeForcedUploadFiles: (newValue: boolean) => void;
  setCurrentFolderInformation: (fileData: FileDetails | null) => void;
}

const initialState = {
  controls: {
    view: FilesViewType.GRID,
  },
  forcedUploadFiles: false,
  isFileDetailsVisible: false,
  fileSelection: {
    filesSelected: [],
  },
  currentFolderInformation: {
    fileData: null,
  },
  previewFileDetails: {
    isVisible: false,
    fileId: "",
    fileContent: null,
  },
};

const useFilesStore = create<FilesStore>()(
  persist(
    (set) => ({
      ...initialState,
      changeDisplayControls: (newControls: Partial<FilesStoreControls>) => {
        set((data) => ({ controls: { ...data.controls, ...newControls } }));
      },
      clearFileSelection: () => {
        set({ fileSelection: { filesSelected: [] } });
      },
      selectFile: (fileId: string, withMultipleSelection: boolean) => {
        set((data) => {
          const alreadySelected =
            data.fileSelection.filesSelected.includes(fileId);

          const previousFiles = data.fileSelection.filesSelected;
          let resultFilesSelected = [];

          if (withMultipleSelection) {
            if (alreadySelected) {
              resultFilesSelected = previousFiles.filter(
                (item) => item !== fileId,
              );
            } else {
              resultFilesSelected = [...previousFiles, fileId];
            }
          } else {
            resultFilesSelected = [fileId];
          }

          return {
            fileSelection: {
              ...data.fileSelection,
              filesSelected: resultFilesSelected,
            },
          };
        });
      },
      setCurrentFolderInformation: (fileData: FileDetails | null) => {
        set({ currentFolderInformation: { fileData } });
      },
      setPreviewFileDetails: (
        newPreviewFileDetails: Partial<PreviewFileDetails>,
      ) => {
        set((data) => ({
          previewFileDetails: {
            ...data.previewFileDetails,
            ...newPreviewFileDetails,
          },
        }));
      },
      changeForcedUploadFiles: (newValue: boolean) => {
        set({ forcedUploadFiles: newValue });
      },
    }),
    {
      name: "FileDisplayLayout",
      getStorage: () => localStorage,
    },
  ),
);

export { useFilesStore };
