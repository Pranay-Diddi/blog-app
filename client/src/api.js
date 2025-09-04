import axios from "axios";

// Base URL for your Render backend
const API_BASE = "https://blog-server-liry.onrender.com";

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====== AUTH ======
export const signup = (username, email, password) =>
  api.post("/signup", { username, email, password });

export const login = (email, password) =>
  api.post("/login", { email, password });

// ====== USERS ======
export const getUsers = () => api.get("/users");

// ====== POSTS ======
export const getPosts = () => api.get("/posts");

export const getUserPosts = (userId) =>
  api.get(`/userposts`, { params: { userid: userId } });

export const addPost = (userId, postData) =>
  api.post("/addPost", postData, { headers: { userid: userId } });

export const editPost = (userId, postData) =>
  api.post("/editPost", postData, { headers: { userid: userId } });

export const deletePost = (userId, postId) =>
  api.delete("/deletePost", {
    data: { id: postId },
    headers: { userid: userId },
  });

export const likePost = (postId, userId) =>
  api.put(`/like/${postId}`, { userid: userId });

// ====== HEALTH CHECK ======
export const healthCheck = () => api.get("/");
