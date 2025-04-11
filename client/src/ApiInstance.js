import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3900/users",
});

export const register = (data) => Api.post("/register", data);

export const login = (data) => Api.post("/login", data);

export const forgotPassword = (data) => Api.post("/forgot-password", data);

export const resetPassword = (token, data) =>
  Api.post(`/reset-password/${token}`, data);
