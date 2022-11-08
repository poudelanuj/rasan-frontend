import { useContext, useState, createContext } from "react";
import { useQuery } from "react-query";
import { isLoggedIn } from "./utils";
import { getUserGroupsById, getUserGroups } from "./api/userGroups";
import { GET_USER_GROUPS_BY_ID, GET_USER_GROUPS } from "./constants/queryKeys";
import { useEffect } from "react";

let AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isMobileView, setIsMobileView] = useState(false);

  let [user, setUser] = useState(isLoggedIn());
  const loginFinalise = (token, profile, groups, callback) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("profile", JSON.stringify(profile || {}));
    localStorage.setItem("groups", JSON.stringify(groups || []));
    setUser(isLoggedIn());
    callback();
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(isLoggedIn());
  };
  const { data: userGroup } = useQuery({
    queryFn: () =>
      getUserGroupsById([
        JSON.parse(localStorage.getItem("groups") || "[]")?.[0]?.id,
      ]),
    queryKey: [GET_USER_GROUPS_BY_ID],
  });

  const { data: userGroupIds } = useQuery({
    queryFn: () => getUserGroups(),
    queryKey: [GET_USER_GROUPS],
  });

  let value = {
    user,
    loginFinalise,
    logout,
    permissions: userGroup && userGroup[0].data.data.permissions,
    userGroupIds: userGroupIds && userGroupIds.map((el) => el.id),
    isMobileView,
  };

  useEffect(() => {
    window.innerWidth < 700 ? setIsMobileView(true) : setIsMobileView(false);

    window.addEventListener("resize", () =>
      window.innerWidth < 700 ? setIsMobileView(true) : setIsMobileView(false)
    );
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
