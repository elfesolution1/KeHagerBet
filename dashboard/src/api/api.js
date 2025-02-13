import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: `https://kehagerbet.onrender.com/api`,
  withCredentials: true,
});

export const baseURL = apiUrl;
