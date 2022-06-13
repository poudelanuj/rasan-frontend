import myaxios from "../myaxios";

export const getUsers = async () => {
  const response = await myaxios.get("/api/profile/admin/user-list/");
  console.log(response.data.data.results);
  return response.data.data.results;
};

export const getUser = async (user_id) => {
  const response = await myaxios.get(
    "/api/profile/admin/user-profile/" + user_id + "/"
  );
  return response.data.data;
};

export const updateUser = async ({ data, key }) => {
  console.log(data, key);
  const response = await myaxios.put(
    `/api/profile/admin/user-profile/` + key + "/",
    data
  );
  return response.data;
};

export const logoutUser = async (number) => {
  const response = await myaxios.post(`/api/auth/logout-user/`, {
    phone: number,
  });
  console.log(response);
  return "Logged out Successfully.";
};

export const deactivateUser = async (number) => {
  const response = await myaxios.post(`/api/auth/deactivate-user/`, {
    phone: number,
  });
  console.log(response);
  return response.data;
};

export const getLastLogin = async (phone) => {
  const response = await myaxios.get(`/api/auth/auth-meta/`, {
    params: { phone: phone },
  });
  let date = new Date(response.data.data.last_login_at);
  return date.toDateString();
};