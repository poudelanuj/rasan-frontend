import React, { useCallback, useContext, useEffect } from "react";
import { Context as UserContext } from "../context/UserContext";
import UserList from "./UserList";
const Users = () => {
  const {
    state: { users, isLoading },
    getUsers,
  } = useContext(UserContext);
  // const [toReload, setToReload] = useState(true);
  // const getUsersCall = useCallback(getUsers, [getUsers]);
  useEffect(() => {
    (async () => {
      await getUsers();
    })(); //IIFE
  }, []);

  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">Users List</div>
      {isLoading && <div>Loading....</div>}
      {users && (
        <div>
          {/* {users.map((user) => (
            <div key={user.id}>{`${user.full_name}`}</div>
          ))} */}
          <UserList users={users} />
        </div>
      )}
    </div>
  );
};

export default Users;
