import apiClient from "./apiClient";

export const toggleLike = (bookId) => apiClient.post(`/likes/${bookId}`).then(({ data }) => data);
export const getLikeCount = (bookId) => apiClient.get(`/likes/${bookId}/count`).then(({ data }) => data);
export const checkLiked = (bookId) => apiClient.get(`/likes/${bookId}/status`).then(({ data }) => data);
