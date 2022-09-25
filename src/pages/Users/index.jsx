import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Input, Spin } from "antd";
import { uniqBy } from "lodash";
import { getUsers } from "../../api/users";
import UserList from "./UserList";

const Users = () => {
  const { Search } = Input;
  const searchText = useRef();
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "get-users",
      page.toString() + pageSize.toString(),
      searchText.current,
    ],
    queryFn: () => getUsers(page, searchText.current, pageSize),
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

  const debounceSearch = () => {
    const delayDebounceFn = setTimeout(refetch, 1000);

    return () => clearTimeout(delayDebounceFn);
  };

  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">Users List</div>
      <Search
        className="mb-4"
        enterButton="Search"
        placeholder="Search User"
        size="large"
        allowClear
        onChange={(e) => {
          searchText.current = e.target.value;
          debounceSearch();
        }}
      />
      {isLoading && <Spin />}
      {users && (
        <div>
          <UserList
            count={data && data.count}
            pageSize={pageSize}
            setPage={setPage}
            users={users}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
