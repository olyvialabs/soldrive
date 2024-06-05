const getUserByWalletQuery = (walletAddress: string) => `
{
    getUser(user_solana: "${walletAddress}") {
        id
        user_solana
        did_public_address
    }
}
`;

export default getUserByWalletQuery;
