const searchUsernamesQuery = (username: string, limit: number) => `
{
    searchUsernames(query: "${username}", limit: ${limit}) {
        id
        user_solana
        did_public_address
        username
        did_public_key
    }
}
`;

export default searchUsernamesQuery;
