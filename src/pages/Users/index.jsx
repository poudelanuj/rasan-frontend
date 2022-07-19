import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../../context/UserContext";
import UserList from "./UserList";

const Users = () => {
  const { data: users, isLoading } = useQuery("get-users", getUsers);
  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">Users List</div>
      {isLoading && <div>Loading....</div>}
      {users && (
        <div>
          <UserList users={users} />
        </div>
      )}
    </div>
  );
};

export default Users;
