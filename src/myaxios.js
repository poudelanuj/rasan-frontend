import axios from "axios";

const myaxios = axios.create();

myaxios.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem("auth_token");

    config.headers["Authorization"] = "Token " + auth_token;
    return config;
  },
  (error) => Promise.reject(error)
);

export default myaxios;
