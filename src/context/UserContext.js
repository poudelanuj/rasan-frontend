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
    default:
      return state;
  }
};

const getUsers = (dispatch) => async () => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");
  const response = await Axios.get("/profile/admin/user-list", {
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
  const response = await Axios.get("/profile/admin/user-profile/" + user_id, {
    headers: {
      Authorization: `Token ${auth_token}`,
    },
  });
  dispatch({ type: "loaded" });
  dispatch({ type: "getUser", payload: response.data.data });
};

const updateUser = (dispatch) => async (data) => {
  dispatch({ type: "loading" });
  const auth_token = localStorage.getItem("auth_token");

  const response = await Axios.put(`/profile/admin/user-profile/1/`, data, {
    headers: {
      Authorization: `Token ${auth_token}`,
    },
  });
  console.log("I have reached");
  dispatch({ type: "loaded" });
  dispatch({
    type: "giveStatus",
    payload: { message: response.data.message, success: response.data.success },
  });
  dispatch({ type: "getUser", payload: response.data.data });
};

// const deleteUser = dispatch => async id => {
//   dispatch({ type: "loading" });
//   const response = await Axios.delete(`/api/user/${id}`);
//   dispatch({ type: "loaded" });
// };

export const { Context, Provider } = createDataContext(
  reducer,
  { getUsers, getUser, updateUser },
  { users: null, isLoading: false, status: { message: null, success: false } }
);
