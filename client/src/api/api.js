import axios from "axios";

// const local = "http://localhost:5000";
// const production = "https://kehagerbet.onrender.com";

// let apiUrl = "";
// let mode = "pro";

// if (mode === "pro") {
//   apiUrl = production;
// } else {
//   apiUrl = local;
// }

export const API = axios.create({
  baseURL: `https://kehagerbet.onrender.com/api`,
  withCredentials: true,
});

export const baseURL = "https://kehagerbet.onrender.com";
