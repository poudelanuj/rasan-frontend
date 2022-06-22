import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupDetail } from "../context/UserGroupContext";
import SetPermission from "./SetPermission";
const columns = [
  {
    title: "User Name",
    dataIndex: "full_name",
    render: (text, record) => {
      return (
        <div>
          {record.profile_picture && (
            <img
              alt={text}
              className="inline pr-4 rounded-[50%]"
              src={record.profile_picture}
              style={{ borderRadius: "50%" }}
              width={50}
            />
          )}
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
];
const UserGroupPage = () => {
  let { group_id } = useParams();
  const [groupColumn, setGroupColumn] = useState([]);
  const [visible, setVisible] = useState(false);

  const { data: userColumn, isSuccess } = useQuery(
    ["get-group-details", group_id],
    async () => getGroupDetail(group_id)
  );

  let navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      let groups2 = userColumn?.users?.map((col, index) => {
        return {
          full_name: "N/A",
          phone: col.username,
          key: index,
        };
      });
      setGroupColumn(groups2);
    }
  }, [userColumn, isSuccess]);

  return (
    <div className="user-group-page">
      <div className="user-title  bg-white p-4">
        <div className="text-gray-700 text-3xl">User Group -{group_id}</div>
      </div>
      <div className="group-list bg-white p-4 mt-3">
        <div className="permissions-button flex justify-between">
          <Button
            className="text-primary border-primary"
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            Set Permissions
          </Button>
          <SetPermission
            id={userColumn?.id}
            name={userColumn?.name}
            permissions={userColumn?.permissions}
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
          />
          <Button className="text-white bg-primary" type="primary">
            Send Push Notifications
          </Button>
        </div>
        <div className="exact-list">
          {groupColumn?.length !== 0 && (
            <Table
              columns={columns}
              dataSource={groupColumn}
              onRow={(record) => {
                return {
                  onDoubleClick: (_) => {
                    navigate("/user/" + record.key);
                  }, // double click row
                };
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGroupPage;
