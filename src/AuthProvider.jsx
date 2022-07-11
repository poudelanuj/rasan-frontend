import { useContext, useState } from "react";
import { createContext } from "react";
import { isLoggedIn } from "./utils";

let AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  let [user, setUser] = useState(isLoggedIn());
  const loginFinalise = (token, callback) => {
    localStorage.setItem("auth_token", token);
    setUser(isLoggedIn());
    callback();
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(isLoggedIn());
  };
  let value = { user, loginFinalise, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
