import apiClient from "./apiClient";

export const getComments = (bookId) => apiClient.get(`/comments/${bookId}`).then(({ data }) => data);
export const createComment = (bookId, comment) =>
    apiClient.post(`/comments/${bookId}`, comment).then(({ data }) => data);
export const deleteComment = (commentId) => apiClient.delete(`/comments/${commentId}`);
