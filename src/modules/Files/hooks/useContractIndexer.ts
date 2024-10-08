import { UserInformationData } from "~/modules/Store/Auth/store";
import getUserByWalletQuery from "../FileUpload/query/getUserByWalletQuery";
import { FetchFilesResponse, FileDetails } from "../FileDisplayer/types";
import getUserSubscriptionByWalletQuery from "../FileUpload/query/getUserSubscriptionByWalletQuery";
import getFileByCidQuery from "../FileUpload/query/getFileByCidQuery";
import searchUsernamesQuery from "../FileUpload/query/searchUsernamesQuery";
import { env } from "~/env";

const indexerUrl = env.NEXT_PUBLIC_INDEXER_SERVICE_URL;

const useContractIndexer = () => {
  const getFileByCid = async (
    cid: string,
  ): Promise<{
    success: boolean;
    error?: string;
    data?: FileDetails;
  }> => {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getFileByCidQuery(cid),
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
          error: `GraphQL error: ${responseBody.errors.map((e) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.getFileByCid,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error fetching user: ${(error as any)?.message || ""}`,
      };
    }
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

  const searchUsernames = async ({
    username,
    limit = 5,
    abortSignal,
  }: {
    username: string;
    limit?: number;
    abortSignal: AbortSignal;
  }): Promise<{
    success: boolean;
    error?: string;
    data?: UserInformationData[];
  }> => {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchUsernamesQuery(username, limit),
        }),
        cache: "no-cache",
        signal: abortSignal,
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
          error: `GraphQL error: ${responseBody.errors.map((e) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.searchUsernames,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error fetching user: ${(error as any)?.message || ""}`,
      };
    }
  };

  const getUserSubscriptionByWallet = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<{
    success: boolean;
    error?: string;
    data?: { id: string; timestamp: number };
  }> => {
    try {
      const response = await fetch(`${indexerUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getUserSubscriptionByWalletQuery(walletAddress),
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
          error: `GraphQL error: ${responseBody.errors.map((e) => e.message).join(", ")}`,
        };
      }

      return {
        success: true,
        data: responseBody.data.getUserSubscriptionByWallet,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error fetching user: ${(error as any)?.message || ""}`,
      };
    }
  };

  async function fetchFilesFromWallet(
    from?: string,
    to?: string,
  ): Promise<FetchFilesResponse> {
    const query = `
        {
            getFilesByFromAndTo(from: "${from || ""}", to: "${to || ""}") {
                id
                slot
                timestamp
                file_id
                from
                to
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
    console.log({ fileData });
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
    username?: string;
    did_public_key?: string;
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

  async function manualSyncSubscriptionCreation(subscriptionQueryData: {
    walletAddress: string;
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
              manualSyncSubscriptionCreation(${Object.entries(
                subscriptionQueryData,
              )
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
        data: responseBody.data.manualSyncSubscriptionCreation,
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
    manualSyncSubscriptionCreation,
    getUserSubscriptionByWallet,
    searchUsernames,
  };
};

export default useContractIndexer;
