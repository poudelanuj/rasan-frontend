import { useContext, useState } from "react";
import { createContext } from "react";
import { loggedInOrNot } from "./utility";

let AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  let [user, _] = useState(loggedInOrNot());

  let value = { user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
