import apiClient from "./apiClient";

export const signup = (data) => apiClient.post("/users/signup", data);

export async function login(data) {
    const response = await apiClient.post("/users/login", data);
    localStorage.setItem("loginUser", JSON.stringify(response.data));
    return response.data;
}

export async function logout() {
    await apiClient.post("/users/logout");
    localStorage.removeItem("loginUser");
}

export async function sessionCheck() {
    try {
        const response = await apiClient.get("/users/session-check");
        return response.data;
    } catch {
        return null;
    }
}
