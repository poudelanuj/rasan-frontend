import React, {useContext} from "react";
import { MdAdminPanelSettings } from "react-icons/md";

import { LoginContext } from "../context/LoginContext";

function Login() {
  const { loginState, loginDispatch, getOtp } = useContext(LoginContext);
  return (
    <>
      <h1 className='text-center py-1 text-xl font-semibold font-["Tahoma"] text-[#00A0B0]'>
        Log in to Dashboard
      </h1>
      <MdAdminPanelSettings fontSize={100} color={"#00A0B0"} />
      <div className="bg-white border-b-2 my-5 border-[#00A0B0] p-2 rounded-lg flex items-center justify-between">
        <div className="mr-2 cursor-pointer">
          <img src="/flag_nepal.svg" className="w-5" alt="" />
        </div>
        <span className="pr-1 text-gray-400">+977</span>
        <input
          className="w-full py-1 px-2 outline-[#00A0B0]"
          type="text"
          placeholder="Phone (98xxxxxxxx)"
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
            await getOtp(loginState.phoneNumber);
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
