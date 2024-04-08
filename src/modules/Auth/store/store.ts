import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthUserType {
  email: string;
  token: string;
}

export interface AuthStore {
  userInformation: AuthUserType | null;
  setAuthUserInfo: (user: AuthUserType) => void;
  clearAuth: () => void;
  shouldShowAuthModal: boolean;
  changeAuthModalVisibility: (newValue: boolean) => void;
}

const initialState = {
  userInformation: null,
  shouldShowAuthModal: true,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthUserInfo: (user) => {
        set({ userInformation: user });
      },
      clearAuth: () => {
        set({ userInformation: null });
      },
      changeAuthModalVisibility: (newValue: boolean) => {
        set({ shouldShowAuthModal: newValue });
      },
    }),
    {
      name: "Auth",
      getStorage: () => localStorage,
    },
  ),
);

export { useAuthStore };
