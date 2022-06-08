import Axios from "axios";
import { createDataContext } from "./createDataContext";
// (users:[samip,a,f], {"GetUsers", payload : [samip,a,f]})
const reducer = (state, action) => {
  switch (action.type) {
    case "getUsers":
      return { ...state, users: action.payload };
    case "getUser":
      return { ...state, user: action.payload };
    case "loading":
      return { ...state, isLoading: true };
    case "loaded":
      return { ...state, isLoading: false };
    case "giveStatus":
      return { ...state, status: action.payload };
    case "getLastLogin":
      return { ...state, lastLogin: action.payload };
    default:
      return state;
  }
};

const getUsers = (dispatch) => async () => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.get("/api/profile/admin/user-list/", {
    headers: {
      Authorization: `Token ${auth_token}`,
    },
  });
  dispatch({ type: "loaded" });
  dispatch({ type: "getUsers", payload: response.data.data.results });
};

const getUser = (dispatch) => async (user_id) => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.get(
    "/api/profile/admin/user-profile/" + user_id,
    {
      headers: {
        Authorization: `Token ${auth_token}`,
      },
    }
  );
  dispatch({ type: "loaded" });
  dispatch({ type: "getUser", payload: response.data.data });
};

const updateUser = (dispatch) => async (data, key) => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  console.log(key);
  const response = await Axios.put(
    `/api/profile/admin/user-profile/` + key + "/",
    data,
    {
      headers: {
        Authorization: `Token ${auth_token}`,
      },
    }
  );
  dispatch({ type: "loaded" });
  dispatch({
    type: "giveStatus",
    payload: { message: response.data.message, success: response.data.success },
  });
  dispatch({ type: "getUser", payload: response.data.data });
};

const logoutUser = (dispatch) => async (number) => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.post(
    `/api/auth/logout-user/`,
    { phone: number },
    {
      headers: {
        Authorization: `Token ${auth_token}`,
      },
    }
  );
  dispatch({ type: "loaded" });
  console.log(response);
  dispatch({
    type: "giveStatus",
    payload: { message: response.data.message, success: response.data.success },
  });
};

const deactivateUser = (dispatch) => async (number) => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.post(
    `/api/auth/deactivate-user/`,
    { phone: number },
    {
      headers: {
        Authorization: `Token ${auth_token}`,
      },
    }
  );
  dispatch({ type: "loaded" });
  console.log(response);
  dispatch({
    type: "giveStatus",
    payload: { message: response.data.message, success: response.data.success },
  });
};

const getLastLogin = (dispatch) => async () => {
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.get(`/api/auth/auth-meta/`, {
    headers: {
      Authorization: `Token ${auth_token}`,
    },
  });
  let date = new Date(response.data.data.last_login_at);
  dispatch({ type: "getLastLogin", payload: response.data.data.last_login_at });
};
export const { Context, Provider } = createDataContext(
  reducer,
  { getUsers, getUser, updateUser, logoutUser, deactivateUser },
  {
    users: null,
    user: null,
    isLoading: false,
    status: { message: null, success: false },
  }
);
