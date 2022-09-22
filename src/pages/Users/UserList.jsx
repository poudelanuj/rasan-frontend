import { Table } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserList = ({ count, users, pageSize, setPage }) => {
  let navigate = useNavigate();

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
      sorter: (a, b) => a.age - b.age,
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
      {userColumns && (
        <Table
          columns={columns}
          dataSource={userColumns}
          pagination={{
            pageSize,
            total: count,

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
