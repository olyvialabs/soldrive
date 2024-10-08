import { persist } from "zustand/middleware";
import { create } from "zustand";

export interface UserInformationData {
  user_solana: string;
  did_public_address: string;
  did_public_key: string;
  username: string;
}

export interface AuthStore {
  userInformation: UserInformationData | null;
  setUserInformationData: (user: UserInformationData) => void;
  clearUserInformation: () => void;
  shouldShowAuthModal: boolean;
  changeAuthModalVisibility: (newValue: boolean) => void;
  subscriptionTimestamp: number;
  setSubscriptionTimestamp: (subscriptionTimestamp: number) => void;
  ssrDownload: boolean;
  setSsrDownload: (newValue: boolean) => void;
}

const initialState = {
  userInformation: null,
  shouldShowAuthModal: true,
  subscriptionTimestamp: 0,
  ssrDownload: true,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInformationData: (user) => {
        set({ userInformation: user });
      },
      clearUserInformation: () => {
        set({ userInformation: null });
      },
      changeAuthModalVisibility: (newValue: boolean) => {
        set({ shouldShowAuthModal: newValue });
      },
      setSubscriptionTimestamp: (subscriptionTimestamp: number) => {
        set({ subscriptionTimestamp });
      },
      setSsrDownload: (newValue: boolean) => {
        set({ ssrDownload: newValue });
      },
    }),
    {
      name: "Auth",
      getStorage: () => localStorage,
    },
  ),
);

export { useAuthStore };
