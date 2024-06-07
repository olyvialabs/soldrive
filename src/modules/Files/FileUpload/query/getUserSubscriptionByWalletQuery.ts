const getUserSubscriptionByWalletQuery = (walletAddress: string) => `
{
    getUserSubscriptionByWallet(walletAddress: "${walletAddress}") {
        id
        timestamp
    }
}
`;

export default getUserSubscriptionByWalletQuery;
