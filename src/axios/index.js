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

axios.defaults.baseURL = "https://api.rasan.com.np";

export default axios;
