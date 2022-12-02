import { Modal, Button, Select, Form } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CreateShippingModal from "./CreateShippingModal";
import ButtonWPermission from "../../../../shared/ButtonWPermission";
import { useMutation } from "react-query";
import { updateOrder } from "../../../../api/orders";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils";

const ViewOrderShipping = ({
  isOpen,
  closeModal,
  userId,
  user,
  refetchOrder,
  refetchUser,
}) => {
  const [form] = Form.useForm();

  const { orderId } = useParams();

  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);

  const handleUpdateOrder = useMutation(
    ({ orderId, data }) => updateOrder(orderId, data),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchOrder();
        closeModal();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  return (
    <Modal
      footer={
        <Button
          htmlType="submit"
          type="primary"
          onClick={() =>
            form
              .validateFields()
              .then((values) =>
                handleUpdateOrder.mutate({ orderId, data: values })
              )
          }
        >
          Save
        </Button>
      }
      title="Create a Shipping Address"
      visible={isOpen}
      onCancel={closeModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          className="!mb-1"
          label={
            <div className="flex gap-3 items-center">
              <span>Shipping Address</span>
              <ButtonWPermission
                className="p-0 m-0 bg-white"
                codename="add_address"
                size="small"
                type="primary"
                onClick={() => setIsCreateShippingOpen(true)}
              >
                + Add Shipping Address
              </ButtonWPermission>
            </div>
          }
          name="shipping_address"
          rules={[
            {
              required: true,
              message: "Shipping address is required",
            },
          ]}
        >
          <Select
            className="w-full"
            placeholder="Select Shipping Address"
            showSearch
          >
            {user?.addresses?.map((address) => (
              <Select.Option key={address.id} value={address.id}>{`${
                address.detail_address || ""
              } ${address.area?.name} - ${address.city?.name}, ${
                address.province?.name
              }`}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <CreateShippingModal
        isCreateShippingOpen={isCreateShippingOpen}
        refetchUserList={refetchUser}
        setIsCreateShippingOpen={setIsCreateShippingOpen}
        userId={userId}
      />
    </Modal>
  );
};

export default ViewOrderShipping;
