import { Modal, Form, Input, Button } from "antd";
import { useMutation } from "react-query";
import { createUser } from "../../../api/users";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";

const CreateUserModal = ({
  isCreateUserOpen,
  setIsCreateUserOpen,
  refetchUserList,
}) => {
  const [form] = Form.useForm();

  const handleUserCreate = useMutation((data) => createUser(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      setIsCreateUserOpen(false);
      refetchUserList();
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  return (
    <Modal
      footer={
        <Button
          htmlType="submit"
          loading={handleUserCreate.status === "loading"}
          type="primary"
          onClick={() =>
            form.validateFields().then((values) => {
              handleUserCreate.mutate(values);
            })
          }
        >
          Create
        </Button>
      }
      title="Create a User"
      visible={isCreateUserOpen}
      onCancel={() => setIsCreateUserOpen(false)}
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
          label="Full Name"
          name="full_name"
          rules={[
            {
              required: true,
              message: "Please input Fullname",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input Phone number",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Shop Name"
          name="shop_name"
          rules={[
            {
              required: true,
              message: "Please input Shop Name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="VAT No." name="pan_vat_number">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
