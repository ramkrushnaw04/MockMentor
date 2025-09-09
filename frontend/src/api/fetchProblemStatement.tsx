import client from "../config/client";

export async function fetchProblemStatement(id: string) {
    try {
        // console.log('fetching problem statement for id:', id);
        const response = await client.get(`/problem/${id}`);
        // console.log(response.data)
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch problem statement');
    }
}