import { useContext, useState } from "react";
import { createContext } from "react";
import { loggedInOrNot } from "./utility";

let AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  let [user, setUser] = useState(loggedInOrNot());
  const loginFinalise = (token, callback) => {
    localStorage.setItem("auth_token", token);
    setUser(loggedInOrNot());
    callback();
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(loggedInOrNot());
  };
  let value = { user, loginFinalise, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
