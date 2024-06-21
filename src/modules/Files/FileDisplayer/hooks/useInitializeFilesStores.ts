import { useAuthStore } from "~/modules/Store/Auth/store";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";

const useInitializeFilesStores = () => {
  const { setPreviewFileDetails, changeForcedUploadFiles } = useFilesStore();
  const {
    changeAuthModalVisibility,
    setUserInformationData,
    setSubscriptionTimestamp,
  } = useAuthStore();
  const { clearStore: clearUserFilesStore } = useUserFilesStore();

  const clearAllStores = () => {
    clearFileRelatedStores();
    changeAuthModalVisibility(true);
    setUserInformationData(null);
    setSubscriptionTimestamp(0);
  };

  const clearFileRelatedStores = () => {
    clearUserFilesStore();
    setPreviewFileDetails({ fileContent: null, fileId: "", isVisible: false });
    changeForcedUploadFiles(false);
  };

  return { clearAllStores, clearFileRelatedStores };
};

export { useInitializeFilesStores };
