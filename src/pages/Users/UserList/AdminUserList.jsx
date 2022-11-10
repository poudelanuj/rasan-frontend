import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Input, Spin } from "antd";
import { isEmpty, uniqBy } from "lodash";
import { getAdminUsers } from "../../../api/users";
import { useAuth } from "../../../AuthProvider";
import { GET_ADMIN_USER } from "../../../constants/queryKeys";
const { Search } = Input;

const AdminUserList = () => {
  let navigate = useNavigate();

  const { userGroupIds } = useAuth();

  const searchText = useRef();
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const [sortObj, setSortObj] = useState({
    sortType: {
      id: true,
      full_name: true,
    },
    sort: [],
  });

  let timeout = 0;

  const { data, refetch, isRefetching, status } = useQuery({
    queryKey: [
      GET_ADMIN_USER,
      page.toString() + pageSize.toString(),
      userGroupIds,
      sortObj.sort,
    ],
    queryFn: () =>
      userGroupIds &&
      getAdminUsers(
        userGroupIds,
        page,
        pageSize,
        searchText.current,
        sortObj.sort
      ),
    enabled: !!userGroupIds,
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setUsers([]);
      setUsers((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const userColumns = users.map((user) => {
    return {
      key: user.id,
      id: user.id,
      full_name: user.full_name || "N/A",
      phone: user.phone,
      profile_picture: user.profile_picture?.small_square_crop,
      shop: user.shop.name || "N/A",
      address: user.addresses[0]?.detail_address || "N/A",
      loyalty_points: user?.extra_info?.loyalty_points || 0,
    };
  });

  const sorting = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record) => (
        <span
          className="text-blue-500"
          onClick={() => navigate(`/user/${record.key}`)}
        >
          #{text}
        </span>
      ),
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sorting(header, "id"),
        };
      },
    },
    {
      title: "Name",
      dataIndex: "full_name",
      width: "25%",
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
            <span className="w-16" style={{ overflowWrap: "anywhere" }}>
              {text}
            </span>
          </div>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sorting(header, "full_name"),
        };
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
      width: "18%",
      render: (_, { shop }) => (
        <span className="w-20" style={{ overflowWrap: "anywhere" }}>
          {shop}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "18%",
      render: (_, { address }) => (
        <span className="w-20" style={{ overflowWrap: "anywhere" }}>
          {address}
        </span>
      ),
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
          timeout = setTimeout(() => {
            setPage(1);
            refetch();
          }, 400);
        }}
      />

      {(status === "loading" || isRefetching) && <Spin />}
      {userColumns && (
        <Table
          columns={columns}
          dataSource={userColumns}
          pagination={{
            showSizeChanger: true,
            pageSize,
            total: data?.count,
            current: page,

            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          scroll={{ x: !isEmpty(userColumns) && 1000 }}
          showSorterTooltip={false}
        />
      )}
    </>
  );
};

export default AdminUserList;
