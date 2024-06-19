import { AuthStore } from "./store";

const getIsUserSubscribed = (data: AuthStore) => {
  console.log({
    data,
    yes: !!data.subscriptionTimestamp && data.subscriptionTimestamp > 0,
  });
  console.log({
    data,
    yes: !!data.subscriptionTimestamp && data.subscriptionTimestamp > 0,
  });
  console.log({
    data,
    yes: !!data.subscriptionTimestamp && data.subscriptionTimestamp > 0,
  });
  return !!data.subscriptionTimestamp && data.subscriptionTimestamp > 0;
};

export { getIsUserSubscribed };
