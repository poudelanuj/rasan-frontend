import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Input, Modal, Divider, List, Checkbox } from "antd";
import { uniqBy } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { updateOrder } from "../../../../api/orders";
import { getAdminUsers } from "../../../../api/users";
import { useAuth } from "../../../../AuthProvider";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils";

const AssignUser = ({ orderId, isOpen, closeModal, assignedTo }) => {
  const { userGroupIds } = useAuth();

  const [page, setPage] = useState(1);

  const [userList, setUserList] = useState([]);

  const [selectedUser, setSelectedUser] = useState(assignedTo);

  let timeout = 0;

  const { data: users, refetch: refetchUserList } = useQuery({
    queryFn: () => userGroupIds && getAdminUsers(userGroupIds, page, 100, ""),
    queryKey: ["getUserList", userGroupIds, page.toString()],
    enabled: !!userGroupIds,
  });

  useEffect(() => {
    if (users) {
      setUserList((prev) => uniqBy([...prev, ...users.results], "id"));
    }
  }, [users]);

  useEffect(() => {
    refetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAssignUser = useMutation(
    (data) => updateOrder(orderId, { assigned_to: data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Order Updated");
        closeModal();
      },
      onSettled: () => {
        // refetchOrders();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      okText="Save"
      title="Assign Users"
      visible={isOpen}
      onCancel={closeModal}
      onOk={() => handleAssignUser.mutate(selectedUser)}
    >
      <Input
        className="!mb-2"
        placeholder="Search Users"
        onChange={(e) => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(async () => {
            setPage(1);
            const res = await getAdminUsers(
              userGroupIds,
              page,
              100,
              e.target.value
            );
            setUserList([]);
            setUserList(uniqBy([...res.results], "id"));
          }, 200);
        }}
      />

      {userList && (
        <InfiniteScroll
          dataLength={userList?.length ?? 0}
          endMessage={<Divider plain>End of the list</Divider>}
          hasMore={users?.next}
          next={() => setPage((prev) => prev + 1)}
        >
          <List
            dataSource={userList}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <Checkbox
                  checked={selectedUser.includes(user.phone)}
                  onChange={(isChecked) => {
                    if (isChecked)
                      return setSelectedUser((prev) => [...prev, user.phone]);

                    setSelectedUser((prev) =>
                      prev.filter((selected) => selected !== user.phone)
                    );
                  }}
                >
                  {user.full_name
                    ? `${user.full_name} (${user.phone})`
                    : user.phone}
                </Checkbox>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </Modal>
  );
};

export default AssignUser;
