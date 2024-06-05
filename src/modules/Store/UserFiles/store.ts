import { persist } from "zustand/middleware";
import { create } from "zustand";
import { FileDetails } from "~/modules/Files/FileDisplayer/types";

export interface UserFilesStore {
  files: FileDetails[];
  errorRetrieving: string | null;
  isRetrievingFiles: boolean;
  setUserFiles: (files: FileDetails[]) => void;
  setUserFilesErrorRetrieving: (error: string | null) => void;
  setUserFilesRetrievingFiles: (loading: boolean) => void;
  clearStore: () => void;
}

const initialState = {
  files: [],
  errorRetrieving: null,
  isRetrievingFiles: false,
};

const useUserFilesStore = create<UserFilesStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserFiles: (files: FileDetails[]) => {
        set({ files });
      },
      setUserFilesErrorRetrieving: (error: string | null) => {
        set({ errorRetrieving: error });
      },
      setUserFilesRetrievingFiles: (loading: boolean) => {
        set({ isRetrievingFiles: loading });
      },
      clearStore: () => {
        set(initialState);
      },
    }),
    {
      name: "UserFilesStore",
      getStorage: () => localStorage,
    },
  ),
);

export { useUserFilesStore };
