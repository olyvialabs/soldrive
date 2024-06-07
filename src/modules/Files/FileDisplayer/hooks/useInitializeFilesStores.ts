import { useAuthStore } from "~/modules/Store/Auth/store";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";

const useInitializeFilesStores = () => {
  const { setPreviewFileDetails, changeForcedUploadFiles } = useFilesStore();
  const { changeAuthModalVisibility } = useAuthStore();
  const { clearStore: clearUserFilesStore } = useUserFilesStore();

  const clearAllStores = () => {
    changeAuthModalVisibility(true);
    clearUserFilesStore();
    setPreviewFileDetails({ fileContent: null, fileId: "", isVisible: false });
    changeForcedUploadFiles(false);
  };

  return { clearAllStores };
};

export { useInitializeFilesStores };
