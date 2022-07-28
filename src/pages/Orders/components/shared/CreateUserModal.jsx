import { Modal, Form, Input } from "antd";
import { useMutation } from "react-query";
import { createUser } from "../../../../api/users";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";

const CreateUserModal = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();

  const handleUserCreate = useMutation((data) => createUser(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      form.resetFields();
      setIsModalOpen(false);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  return (
    <Modal
      cancelText="Cancel"
      okText="Create"
      title="Create a User"
      visible={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        form.resetFields();
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          handleUserCreate.mutate(values);
        });
      }}
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
              message: "Please input fullname!",
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

        <Form.Item
          label="VAT No."
          name="pan_vat_number"
          rules={[
            {
              required: true,
              message: "Please input VAT No.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
