import { Modal, Form, Input, Button } from "antd";
import { useMutation } from "react-query";
import { createShippingAddress } from "../../../../api/userAddresses";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";

const CreateShippingModal = ({
  isCreateShippingOpen,
  setIsCreateShippingOpen,
  userId,
  refetchUserList,
}) => {
  const [form] = Form.useForm();

  const handleShippingCreate = useMutation(
    ({ id, data }) => createShippingAddress({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        setIsCreateShippingOpen(false);
        refetchUserList();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      footer={
        <Button
          htmlType="submit"
          loading={handleShippingCreate.status === "loading"}
          type="primary"
          onClick={() =>
            form.validateFields().then((values) => {
              handleShippingCreate.mutate({ id: userId, data: values });
            })
          }
        >
          Create
        </Button>
      }
      title="Create a Shipping Address"
      visible={isCreateShippingOpen}
      onCancel={() => setIsCreateShippingOpen(false)}
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
          label="Detail Address"
          name="detail_address"
          rules={[
            {
              required: true,
              message: "Please input Detail Address",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Province"
          name="province"
          rules={[
            {
              required: true,
              message: "Please input Province",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please input City",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Area"
          name="area"
          rules={[
            {
              required: true,
              message: "Please input Area",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateShippingModal;
