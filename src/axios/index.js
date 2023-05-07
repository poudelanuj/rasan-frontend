import Axios from "axios";

const axios = Axios.create();

axios.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem("auth_token");

    config.headers["Authorization"] = "Token " + auth_token;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export default axios;
