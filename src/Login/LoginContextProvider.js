import React, { createContext, useReducer } from "react";

export const LoginContext = createContext();

function LoginContextProvider({ children }) {
  const initialState = {
    phoneNumber: "",
    otp: "",
    loginWidgetState: "login", // login, otp, loading
    showToast: false,
    toastMessage: "",
    toastHeading: "",
    toastType: "",
  };

  const loginReducer = (state, action) => {
    switch (action.type) {
      case "SET_PHONE_NUMBER":
        // check if phone number is numeric
        if (!isNaN(action.payload) && action.payload.length <= 10) {
          return {
            ...state,
            phoneNumber: action.payload,
          };
        }
        return state;
      case "SET_OTP":
        return {
          ...state,
          otp: action.payload,
        };
      case "SET_IS_LOGGED_IN":
        return {
          ...state,
          isLoggedIn: action.payload,
        };
      case "SET_LOGINW_STATE":
        return {
          ...state,
          loginWidgetState: action.payload,
        };
      case "SET_TOAST":
        return {
          ...state,
          showToast: action.payload.showToast,
          toastMessage: action.payload.toastMessage,
          toastHeading: action.payload.toastHeading,
          toastType: action.payload.toastType,
        };
      default:
        return state;
    }
  };

  const [loginState, loginDispatch] = useReducer(loginReducer, initialState);

  return (
    <LoginContext.Provider value={{ loginState, loginDispatch }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginContextProvider;
