import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Input, Spin } from "antd";
import { uniqBy } from "lodash";
import { getUsers } from "../../api/users";
const { Search } = Input;

const UserList = () => {
  let navigate = useNavigate();

  const searchText = useRef();
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  let timeout = 0;

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

  const userColumns = users.map((user) => {
    return {
      key: user.id,
      full_name: user.full_name || "N/A",
      phone: user.phone,
      profile_picture: user.profile_picture?.small_square_crop,
      shop: user.shop.name || "N/A",
      address: user.addresses[0]?.detail_address || "N/A",
      loyalty_points: user?.extra_info?.loyalty_points || 0,
    };
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "full_name",
      render: (text, record) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => navigate("/user/" + record.key)}
          >
            {record.profile_picture && (
              <img
                alt={"text"}
                className="inline pr-4 rounded-[50%]"
                src={record.profile_picture}
                style={{ borderRadius: "50%" }}
                width={50}
              />
            )}{" "}
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      defaultSortOrder: "descend",
      render: (_, { phone, key }) => (
        <span
          className="cursor-pointer"
          onClick={() => navigate("/user/" + key)}
        >
          {phone}
        </span>
      ),
    },
    {
      title: "Shop Name",
      dataIndex: "shop",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyalty_points",
    },
  ];
  return (
    <>
      <Search
        className="mb-4"
        enterButton="Search"
        placeholder="Search User"
        size="large"
        onChange={(e) => {
          searchText.current = e.target.value;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(refetch, 400);
        }}
      />

      {isLoading && <Spin />}

      {userColumns && (
        <Table
          columns={columns}
          dataSource={userColumns}
          pagination={{
            pageSize,
            total: data?.count,

            onChange: (page, pageSize) => {
              setPage(page);
            },
          }}
        />
      )}
    </>
  );
};

export default UserList;
