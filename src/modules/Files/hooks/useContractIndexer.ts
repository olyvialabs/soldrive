import { UserInformationData } from "~/modules/Store/Auth/store";
import getUserByWalletQuery from "../FileUpload/query/getUserByWalletQuery";
import { FetchFilesResponse } from "../FileDisplayer/types";

const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_SERVICE_URL;
const useContractIndexer = () => {
  const getFileByCid = () => {
    return null;
  };

  const getUserByWallet = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<{
    success: boolean;
    error?: string;
    data?: UserInformationData;
  }> => {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getUserByWalletQuery(walletAddress),
        }),
        cache: "no-cache",
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Network response was not ok: ${response.statusText}`,
        };
      }

      const responseBody = await response.json();
      console.log(responseBody);
      console.log("aaaah", responseBody);
      if (responseBody.errors) {
        return {
          success: false,
          error: `GraphQL error: ${responseBody.errors.map((e) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.getUser,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error fetching user: ${(error as any)?.message || ""}`,
      };
    }
  };

  async function fetchFilesFromWallet(
    from: string,
  ): Promise<FetchFilesResponse> {
    const query = `
        {
            getFilesByFromAndTo(from: "${from}") {
                id
                slot
                timestamp
                file_id
                name
                weight
                file_parent_id
                cid
                typ
            }
        }
    `;

    try {
      console.log("Loading...");

      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
        cache: "no-cache",
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Network response was not ok: ${response.statusText}`,
        };
      }

      const responseBody = await response.json();

      if (responseBody.errors) {
        return {
          success: false,
          error: `GraphQL error: ${responseBody.errors.map((e: { message: string }) => e.message).join(", ")}`,
        };
      }

      console.log("Data retrieved successfully");
      return {
        success: true,
        data: responseBody.data.getFilesByFromAndTo,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error fetching files: ${(error as Error).message}`,
      };
    } finally {
      console.log("Loading complete");
    }
  }
  async function manualSyncFileCreation(fileData: {
    name?: string;
    weight?: number;
    file_parent_id?: string;
    cid?: string;
    from?: string;
    to?: string;
    typ?: string;
  }) {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              manualSyncFileCreation(${Object.entries(fileData)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(", ")}) {
                  result
              }
            }
          `,
        }),
        cache: "no-cache",
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Network response was not ok: ${response.statusText}`,
        };
      }

      const responseBody = await response.json();

      if (responseBody.errors) {
        return {
          success: false,
          error: `GraphQL error: ${responseBody.errors.map((e: { message: string }) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.manualSyncFileCreation,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error syncing file: ${(error as any)?.message || ""}`,
      };
    }
  }

  async function manualSyncUserCreation(userData: {
    user_solana?: string;
    did_public_address?: string;
  }) {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              manualSyncUserCreation(${Object.entries(userData)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(", ")}) {
                  result
              }
            }
          `,
        }),
        cache: "no-cache",
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Network response was not ok: ${response.statusText}`,
        };
      }

      const responseBody = await response.json();

      if (responseBody.errors) {
        return {
          success: false,
          error: `GraphQL error: ${responseBody.errors.map((e: { message: string }) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.manualSyncUserCreation,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error syncing user: ${(error as any)?.message || ""}`,
      };
    }
  }

  return {
    getFileByCid,
    getUserByWallet,
    fetchFilesFromWallet,
    manualSyncFileCreation,
    manualSyncUserCreation,
  };
};

export default useContractIndexer;
