import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/vendor"
});

export const signupVendor = (formData) =>
  API.post("/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const loginVendor = (data) =>
  API.post("/login", data);
