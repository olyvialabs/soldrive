import { AuthStore } from "./store";

const getIsUserSubscribed = (data: AuthStore) => {
  if (!data.subscriptionTimestamp || data.subscriptionTimestamp === 0) {
    return false;
  }

  const inputDate = new Date(data.subscriptionTimestamp);
  const currentDate = new Date();
  const differenceInTime = currentDate - inputDate;
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  return differenceInDays <= 30;
};

export { getIsUserSubscribed };
