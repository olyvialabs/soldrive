import { AuthStore } from "./store";

const getIsUserSubscribed = (data: AuthStore) => {
  return !!data.subscriptionTimestamp;
};

export { getIsUserSubscribed };
