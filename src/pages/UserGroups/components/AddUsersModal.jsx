import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Modal, Button, Form, Select } from "antd";
import { uniqBy } from "lodash";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import { getUsers } from "../../../api/users";
import {
  GET_USERS,
  GET_USER_GROUPS,
  GET_USER_GROUPS_BY_ID,
} from "../../../constants/queryKeys";
import { addUser } from "../../../api/userGroups";

const AddUsersModal = ({ isOpen, onClose }) => {
  const { groupId } = useParams();

  const [form] = Form.useForm();

  const { Option } = Select;

  const queryClient = useQueryClient();

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

  const handleAddUser = useMutation(({ id, data }) => addUser({ id, data }), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      queryClient.refetchQueries([GET_USER_GROUPS]);
      queryClient.refetchQueries([GET_USER_GROUPS_BY_ID]);
      form.resetFields();
      onClose();
    },
    onError: (err) => openErrorNotification(err),
  });

  return (
    <Modal
      cancelText="Cancel"
      centered={true}
      footer={
        <>
          <Button className="mr-2" type="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={handleAddUser.isLoading}
            type="primary"
            onClick={() => {
              form.validateFields().then((values) => {
                handleAddUser.mutate({ id: groupId, data: values });
              });
            }}
          >
            Add
          </Button>
        </>
      }
      title="Add Users to group"
      visible={isOpen}
      onCancel={onClose}
    >
      <Form
        form={form}
        initialValues={{
          modifier: "public",
        }}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item label="Users" name="users">
          <Select
            filterOption={false}
            mode="multiple"
            placeholder="Select users"
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
                <Option key={el.id} value={el.phone}>
                  {el.full_name ? `${el.full_name} (${el.phone})` : el.phone}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUsersModal;
