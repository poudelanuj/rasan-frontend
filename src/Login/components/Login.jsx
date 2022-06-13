import React from "react";
import axios from "axios";
import { MdAdminPanelSettings } from "react-icons/md";

function Login({ loginObject }) {
  const { loginState, loginDispatch } = loginObject;
  return (
    <>
      <h1 className='text-center py-1 text-xl font-semibold font-["Tahoma"] text-[#00A0B0]'>
        Log in to Dashboard
      </h1>
      <MdAdminPanelSettings color={"#00A0B0"} fontSize={100} />
      <div className="bg-white border-b-2 my-5 border-[#00A0B0] p-2 rounded-lg flex items-center justify-between">
        <div className="mr-2 cursor-pointer">
          <img alt="" className="w-5" src="/flag_nepal.svg" />
        </div>
        <span className="pr-1 text-gray-400">+977</span>
        <input
          className="w-full py-1 px-2 outline-[#00A0B0]"
          placeholder="Phone (98xxxxxxxx)"
          type="text"
          value={loginState.phoneNumber}
          onChange={(e) =>
            loginDispatch({ type: "SET_PHONE_NUMBER", payload: e.target.value })
          }
        />
      </div>
      <button
        className="bg-[#00A0B0] text-white py-1 px-5 rounded-md transition text-base hover:bg-[#008A97]"
        type="button"
        onClick={async () => {
          if (loginState.phoneNumber.length === 10) {
            loginDispatch({ type: "SET_LOGINW_STATE", payload: "loading" });
            await axios
              .post("/api/auth/request/", {
                phone: `+977-${loginState.phoneNumber}`,
              })
              .then((res) => {
                if (res.data.success) {
                  loginDispatch({
                    type: "SET_TOAST",
                    payload: {
                      showToast: true,
                      toastType: "success",
                      toastMessage: res.data.message,
                      toastHeading: "Success",
                    },
                  });
                  loginDispatch({ type: "SET_LOGINW_STATE", payload: "otp" });
                } else {
                  loginDispatch({
                    type: "SET_TOAST",
                    payload: {
                      showToast: true,
                      toastType: "error",
                      toastHeading: res.data.message,
                      toastMessage: res.data.errors.map((error) => {
                        return error[0];
                      }),
                    },
                  });
                  loginDispatch({ type: "SET_LOGINW_STATE", payload: "login" });
                }
              })
              .catch((err) => {
                loginDispatch({
                  type: "SET_TOAST",
                  payload: {
                    showToast: true,
                    toastMessage:
                      (err.response.data &&
                        err.response.data.message &&
                        err.response.data.message) ||
                      (err.message && err.message) ||
                      "Something went wrong. OTP wasn't sent!",
                    toastType: "error",
                    toastHeading: "Error",
                  },
                });
                loginDispatch({ type: "SET_LOGINW_STATE", payload: "login" });
              });
          } else {
            loginDispatch({
              type: "SET_TOAST",
              payload: {
                showToast: true,
                toastMessage: "Please enter valid phone number",
                toastType: "error",
                toastHeading: "Error",
              },
            });
          }
        }}
      >
        Get OTP
      </button>
    </>
  );
}

export default Login;
