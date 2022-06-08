import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Customer Name",
    dataIndex: "full_name",
    render: (text, record) => {
      return (
        <div>
          {record.profile_picture && (
            <img
              src={record.profile_picture}
              width={50}
              alt={"text"}
              style={{ borderRadius: "50%" }}
              className="inline pr-4 rounded-[50%]"
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

const UserList = ({ users }) => {
  let navigate = useNavigate();
  const [userColumns, setUserColumns] = useState([]);
  useEffect(() => {
    let users2 = users.map((user) => {
      return {
        key: user.id,
        full_name: user.full_name || "N/A",
        phone: user.phone,
        profile_picture: user.profile_picture?.small_square_crop,
        shop: user.shop.name || "N/A",
        address: user.addresses[0]?.detail_address || "N/A",
        loyalty_points: 500,
      };
    });
    setUserColumns(users2);
  }, [users]);
  return (
    <>
      {userColumns.length !== 0 && (
        <Table
          onRow={(record) => {
            console.log(record);
            return {
              onDoubleClick: (_) => {
                navigate("/user/" + record.key);
              }, // double click row
            };
          }}
          columns={columns}
          dataSource={userColumns}
        />
      )}
    </>
  );
};

export default UserList;
