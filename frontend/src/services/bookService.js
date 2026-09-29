import apiClient from "./apiClient";

export const getBooks = () => apiClient.get("/books").then(({ data }) => data);
export const getBook = (bookId) => apiClient.get(`/books/${bookId}`).then(({ data }) => data);
export const createBook = (book) => apiClient.post("/books", book).then(({ data }) => data);
export const updateBook = (bookId, book) => apiClient.put(`/books/${bookId}`, book).then(({ data }) => data);
export const deleteBook = (bookId) => apiClient.delete(`/books/${bookId}`);
export const getMyBooks = () => apiClient.get("/books/my").then(({ data }) => data);
export const generateAiCover = (request) => apiClient.post("/books/ai-cover", request).then(({ data }) => data);
export const saveAiCover = (bookId, coverImageUrl) =>
    apiClient.put("/books/ai-image", { bookId, coverImageUrl });
