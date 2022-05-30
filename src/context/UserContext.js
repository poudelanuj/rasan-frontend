import Axios from "axios";
import { useCallback } from "react";
import { createDataContext } from "./createDataContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "getUsers":
      return { ...state, users: action.payload };
    case "loading":
      return { ...state, isLoading: true };
    case "loaded":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

const getUsers = dispatch => async () => {
  dispatch({ type: "loading" });
  const auth_token=localStorage.getItem("auth_token")
  const response = await Axios.get("/profile/admin/user-list",{headers:{
      Authorization:`Token ${auth_token}`
  }});
  dispatch({ type: "loaded" });
  dispatch({ type: "getUsers", payload: response.data.data.results });
}


// const createUser = dispatch => async ({ name, email, phone }) => {
//   dispatch({ type: "loading" });
//   const response = await Axios.post(`/user-list`, { name, email, phone });
//   dispatch({ type: "loaded" });
// };

// const deleteUser = dispatch => async id => {
//   dispatch({ type: "loading" });
//   const response = await Axios.delete(`/api/user/${id}`);
//   dispatch({ type: "loaded" });
// };

export const { Context, Provider } = createDataContext(
  reducer,
  { getUsers },
  { users: null, isLoading: false }
);
