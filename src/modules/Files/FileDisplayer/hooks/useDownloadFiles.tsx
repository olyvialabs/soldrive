import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { FileDetails } from "../types";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";
import { toast } from "sonner";
import useContractIndexer from "../../hooks/useContractIndexer";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { decryptIpfsFile } from "../../utils/decryptIpfsFile";

const useDownloadFiles = () => {
  const { fileSelection } = useFilesStore();
  const { files: allFiles } = useUserFilesStore();
  const { ssrDownload } = useAuthStore();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();
  const { getUserByWallet } = useContractIndexer();

  const downloadSpecificFile = async (
    fileId: string,
    privateKeyUserDid: string,
    options?: { specificTargetedFile?: FileDetails; returnBlob?: boolean },
  ) => {
    const foundItem = options?.specificTargetedFile
      ? options?.specificTargetedFile
      : allFiles.find((item) => item.id === fileId);

    if (!foundItem || foundItem.typ === "folder") {
      return;
    }

    try {
      // const data = Buffer.from(
      //   `${foundItem.cid}||${privateKeyUserDid}`,
      // ).toString("base64");
      // const response = await fetch("/api/forward-download", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     metadata: {
      //       version: 1,
      //       // to avoid having weird structure in the JSON result
      //       data,
      //     },
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }
      // const contentDisposition = response.headers.get("Content-Disposition");
      // const filename = foundItem.name;

      // // Convert the response body to a Blob
      // const blob = await response.blob();
      // // Create a URL for the Blob and create a link element to download the file
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = filename;

      // // Append the link to the document body and trigger a click to start the download
      // document.body.appendChild(link);
      // link.click();

      // // Clean up the link element and URL object
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);
      // return;
      const decryptedFile = await decryptIpfsFile(
        foundItem.cid,
        privateKeyUserDid,
      );

      if (!decryptedFile) {
        toast("You don't have permissions to download this file", {
          description: "Ask for permissions to the owner first!",
        });
        return;
      }

      let contentType = "application/octet-stream";
      var blob = new Blob([decryptedFile], {
        type: contentType,
      });

      if (options?.returnBlob) {
        return blob;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = foundItem.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error retrieving file content:", error);
      throw error;
    }
  };

  const downloadFiles = async (specificTargetedFile?: FileDetails) => {
    // defualts to the actual user
    const fromWallet = await getUserByWallet({
      walletAddress: specificTargetedFile?.from!,
    });

    if (fromWallet.error || !fromWallet.success) {
      toast("There was an issue retrieving destination user information", {
        description: "Try again later",
      });
      return;
    }

    const { privateKeyString } = await generateUniqueCredentials();
    if (!specificTargetedFile) {
      for (let fileId of fileSelection.filesSelected) {
        // not valid because public change between file
        // and it's taking self user public key
        await downloadSpecificFile(fileId, privateKeyString);
      }
    } else {
      await downloadSpecificFile(
        specificTargetedFile.id, // we don't care, we care about specificTargetedFile obj
        privateKeyString,
        { specificTargetedFile },
      );
    }
  };

  return { downloadFiles, downloadSpecificFile };
};

export default useDownloadFiles;
