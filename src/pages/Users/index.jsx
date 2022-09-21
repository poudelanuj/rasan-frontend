import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import { getUsers } from "../../context/UserContext";
import UserList from "./UserList";

const Users = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-users", page.toString() + pageSize.toString()],
    queryFn: () => getUsers(page, pageSize),
  });

  useEffect(() => {
    if (data) {
      setUsers([]);
      setUsers((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">Users List</div>
      {isLoading && <div>Loading....</div>}
      {users && (
        <div>
          <UserList
            count={data && data.count}
            setPage={setPage}
            users={users}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
