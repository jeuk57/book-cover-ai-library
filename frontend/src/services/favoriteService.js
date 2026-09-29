import apiClient from "./apiClient";

export const toggleFavorite = (bookId) => apiClient.post(`/favorites/${bookId}`).then(({ data }) => data);
export const getFavoriteCount = (bookId) => apiClient.get(`/favorites/${bookId}/count`).then(({ data }) => data);
export const getFavorites = () => apiClient.get("/favorites").then(({ data }) => data);

export async function checkFavorited(bookId) {
    try {
        const response = await apiClient.get(`/favorites/${bookId}/check`);
        return response.data;
    } catch {
        return false;
    }
}
