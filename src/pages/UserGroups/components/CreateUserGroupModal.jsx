import { Modal, Button, Form, Input } from "antd";
import { isEmpty } from "lodash";
import { useMutation, useQueryClient } from "react-query";
import { createUserGroup } from "../../../api/userGroups";
import { GET_USER_GROUPS } from "../../../constants/queryKeys";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const CreateUserGroupModal = ({ isOpen, onClose, userGroup }) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const handleCreateUserGroup = useMutation((data) => createUserGroup(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      queryClient.refetchQueries([GET_USER_GROUPS]);
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
            loading={handleCreateUserGroup.isLoading}
            type="primary"
            onClick={() => {
              form.validateFields().then((values) => {
                handleCreateUserGroup.mutate(values);
              });
            }}
          >
            Create
          </Button>
        </>
      }
      title="Create User Group"
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
        <Form.Item
          label="Group Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input group name",
            },
            {
              validator: (_, value) =>
                !isEmpty(
                  userGroup?.find(
                    ({ name }) => name.toLowerCase() === value.toLowerCase()
                  )
                )
                  ? Promise.reject(`${value} already exist`)
                  : Promise.resolve(),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserGroupModal;
