import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Button, Space, Table, Dropdown, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  getUserGroupsById,
  removeUser,
  sendNotification,
} from "../../../api/userGroups";
import { GET_USER_GROUPS_BY_ID } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import AddUsersModal from "./AddUsersModal";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import UpdateUserGroupModal from "./UpdateUserGroupModal";

const UserGroupPage = () => {
  const { groupId } = useParams();

  const [users, setUsers] = useState([]);

  const [isAddUserModal, setIsAddUserModal] = useState(false);

  const [isRemoveUserModal, setIsRemoveUserModal] = useState(false);

  const [isUpdateUserGroupModal, setIsUpdateUserGroupModal] = useState(false);

  const {
    data: userGroup,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => getUserGroupsById([groupId && groupId]),
    queryKey: [GET_USER_GROUPS_BY_ID, groupId],
    enabled: !!groupId,
  });

  const handleRemoveUser = useMutation(
    () => removeUser({ id: groupId, data: { users } }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        setUsers([]);
        setIsRemoveUserModal(false);
        refetch();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleSendNotification = useMutation(() => sendNotification(groupId), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
    },
    onError: (err) => openErrorNotification(err),
  });

  const userGroupData =
    userGroup &&
    userGroup[0].data.data.users.map((el, index) => {
      return {
        key: index + 1,
        phone: el.username,
        name: el.name,
        permissions: el.permissions,
      };
    });

  const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, { phone }) => {
        return (
          <DeleteOutlined
            onClick={() => {
              setIsRemoveUserModal(true);
              setUsers([phone]);
            }}
          />
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setUsers(selectedRows.map((el) => el.phone));
    },
  };

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: <div onClick={() => setIsRemoveUserModal(true)}>Delete</div>,
        },
      ]}
    />
  );

  return (
    <>
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <CustomPageHeader title={userGroup && userGroup[0].data.data.name} />

          <div className="py-5 px-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between mb-6">
              <Space>
                <Button
                  type="primary"
                  ghost
                  onClick={() => setIsAddUserModal(true)}
                >
                  Add User
                </Button>

                <Button
                  type="primary"
                  ghost
                  onClick={() => setIsUpdateUserGroupModal(true)}
                >
                  Set Permisisons
                </Button>
              </Space>

              <Space>
                <Button
                  loading={handleSendNotification.isLoading}
                  type="primary"
                  onClick={() => handleSendNotification.mutate()}
                >
                  Send Push Notification
                </Button>
                <Dropdown overlay={bulkMenu}>
                  <Button className="bg-white" type="default">
                    <Space>Bulk Actions</Space>
                  </Button>
                </Dropdown>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={userGroupData}
              rowSelection={rowSelection}
            />
          </div>

          <AddUsersModal
            isOpen={isAddUserModal}
            onClose={() => setIsAddUserModal(false)}
          />

          <UpdateUserGroupModal
            id={groupId}
            initialGroupName={userGroup && userGroup[0].data.data.name}
            initialPermission={userGroup && userGroup[0].data.data.permissions}
            isOpen={isUpdateUserGroupModal}
            onClose={() => setIsUpdateUserGroupModal(false)}
          />

          <ConfirmDelete
            closeModal={() => setIsRemoveUserModal(false)}
            deleteMutation={() => handleRemoveUser.mutate()}
            isOpen={isRemoveUserModal}
            status={handleRemoveUser.status}
            title={"Remove User?"}
          />
        </>
      )}
    </>
  );
};

export default UserGroupPage;
