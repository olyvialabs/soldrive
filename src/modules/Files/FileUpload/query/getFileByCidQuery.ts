const getFileByCidQuery = (cid: string) => `
{
    getFileByCid(cid: "${cid}") {
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

export default getFileByCidQuery;
