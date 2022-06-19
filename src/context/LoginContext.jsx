import axios from "axios";

export const otpRequest = async ({ number }) => {
  let response = await axios.post(`/api/auth/request/`, { phone: number });
  return response.data;
};
export const login = async ({ phone, otp }) => {
  let response = await axios.post(`/api/auth/login/`, {
    pin: otp,
    phone: phone,
  });
  return response.data;
};
