import React, { createContext, useReducer } from "react";

export const createLoginContext = (
  loginReducer,
  loginActions,
  initialState
) => {
  const LoginContext = createContext();

  function LoginContextProvider({ children }) {
    const [loginState, loginDispatch] = useReducer(loginReducer, initialState);

    const boundActions = {};

    for (let key in loginActions) {
      boundActions[key] = loginActions[key](loginDispatch);
    }

    return (
      <LoginContext.Provider
        value={{ loginState, loginDispatch, ...boundActions }}
      >
        {children}
      </LoginContext.Provider>
    );
  }

  return { LoginContext, LoginContextProvider };
};
