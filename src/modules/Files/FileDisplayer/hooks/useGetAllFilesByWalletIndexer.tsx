import useContractIndexer from "../../hooks/useContractIndexer";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";

const useGetAllFilesByWalletIndexer = () => {
  const { fetchFilesFromWallet } = useContractIndexer();
  const {
    setUserFiles,
    setUserFilesRetrievingFiles,
    setUserFilesErrorRetrieving,
  } = useUserFilesStore();

  const getFilesByWallet = async (from?: string, to?: string) => {
    setUserFilesRetrievingFiles(true);
    setUserFilesErrorRetrieving(null);

    const response = await fetchFilesFromWallet(from, to);

    if (response.success) {
      setUserFiles(response.data || []);
    } else {
      setUserFilesErrorRetrieving(response.error || "Unknown error");
    }

    setUserFilesRetrievingFiles(false);
  };

  return { getFilesByWallet };
};

export default useGetAllFilesByWalletIndexer;
