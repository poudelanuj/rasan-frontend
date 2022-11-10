import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useState, useEffect } from "react";
import { capitalize, uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";
import { createNotificationGroup } from "../../../api/notifications";
import { getUserGroups } from "../../../api/userGroups";
import { getUsers } from "../../../api/users";
import { NOTIFICATION_TYPES } from "../../../constants";
import { GET_USER_GROUPS, GET_USERS } from "../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const CreateNotification = ({ isOpen, onClose, refetchNotifications }) => {
  const { data: userGroups, status: userGroupStatus } = useQuery(
    GET_USER_GROUPS,
    getUserGroups
  );

  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);

  let timeout = 0;

  const { data, refetch } = useQuery({
    queryFn: () => getUsers(page, "", 100),
    queryKey: [GET_USERS, page.toString()],
  });

  useEffect(() => {
    if (data) setUsers((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onFormSubmit = useMutation(
    (formValues) => {
      return createNotificationGroup(formValues);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Created"),
      onError: (error) => openErrorNotification(error),
      onSettled: () => {
        onClose();
        refetchNotifications();
      },
    }
  );

  return (
    <Modal
      footer={false}
      title={<>Create Notification</>}
      visible={isOpen}
      width={1000}
      onCancel={onClose}
    >
      <Form
        layout="vertical"
        onFinish={(values) => onFormSubmit.mutate(values)}
      >
        <Form.Item
          label="Notification Title"
          name="title"
          rules={[{ required: true, message: "Notification title required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Notification Description" name="content">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="grid gap-2 grid-cols-3">
          <Form.Item
            label="Notification Type"
            name="type"
            rules={[{ required: true, message: "Notification type required" }]}
          >
            <Select placeholder="Select Type" allowClear>
              {NOTIFICATION_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {capitalize(type.replaceAll("_", " "))}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Users"
            name="users"
            tooltip="If you want to send the notification to users, select this field. Else, leave empty to send the notification to all users."
          >
            <Select
              filterOption={false}
              mode="multiple"
              placeholder="Select Users"
              allowClear
              onPopupScroll={() => data?.next && setPage((prev) => prev + 1)}
              onSearch={(val) => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(async () => {
                  setPage(1);
                  const res = await getUsers(page, val, 100);
                  setUsers([]);
                  setUsers(res.results);
                }, 200);
              }}
            >
              {users &&
                users.map((el) => (
                  <Select.Option key={el.id} value={el.phone}>
                    {el.full_name ? `${el.full_name} (${el.phone})` : el.phone}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="User Groups"
            name="user_groups"
            tooltip="If you want to send the notification to user groups, select this field. Else, leave empty to send the notification to all groups."
          >
            <Select
              loading={userGroupStatus === "loading"}
              mode="multiple"
              placeholder="Select User Group"
              allowClear
            >
              {userGroups?.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Space className="w-full flex justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              htmlType="submit"
              loading={onFormSubmit.status === "loading"}
              size="medium"
              type="primary"
            >
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNotification;
