import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loggedInOrNot } from "../utility";
import LoginScreen from "./LoginScreen";

import { LoginContextProvider } from "./context/LoginContext";

function LoginApp() {
  // check if user is logged in
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (loggedInOrNot()) {
  //     navigate("/");
  //   }
  // }, [navigate]);
  return (
    <LoginContextProvider>
      <LoginScreen />
    </LoginContextProvider>
  );
}

export default LoginApp;
