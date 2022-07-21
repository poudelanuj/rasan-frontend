import { Button, Form, Modal, Select, Spin } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../../constants";
import { createOrder, getUserList } from "../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const CreateOrder = ({
  isOpen,
  closeModal,
  title,

  // * From Live User Basket
  isFromLiveUserBasket,
  userId,
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedUserPhone, setSelectedUserPhone] = useState(0);

  const { data: userList, status: userListStatus } = useQuery({
    queryFn: () => getUserList(),
    queryKey: ["getUserList"],
  });

  const onFinish = useMutation(
    (formValues) =>
      createOrder({
        status: formValues.status,
        payment: {
          payment_method: formValues.payment_method,
          status: formValues.payment_status,
        },
        user: isFromLiveUserBasket ? userId : formValues.user,
        shipping_address: formValues.shipping_address,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Order Created");
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal footer={false} title={title} visible={isOpen} onCancel={closeModal}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFinish.mutate(values)}
      >
        <Form.Item
          label="Order Status"
          name="status"
          rules={[
            {
              required: true,
              message: "order status is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Order Status"
            showSearch
          >
            <Option value={IN_PROCESS}>In Process</Option>
            <Option value={CANCELLED}>Cancelled</Option>
            <Option value={DELIVERED}>Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="payment_method"
          rules={[
            {
              required: true,
              message: "payment method is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Payment Method"
            showSearch
          >
            <Option value="cash_on_delivery">Cash On Delivery</Option>
            <Option value="esewa">Esewa</Option>
            <Option value="Khalti">Khalti</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Payment Status"
          name="payment_status"
          rules={[
            {
              required: true,
              message: "payment status is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Payment Status"
            showSearch
          >
            <Option value="unpaid">Unpaid</Option>
            <Option value="paid">Paid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <>
              <span>User</span>
              {userListStatus === "loading" && (
                <Spin className="mx-3" size="small" />
              )}
            </>
          }
          name="user"
          rules={[
            {
              required: true,
              message: "user is required",
            },
          ]}
        >
          <Select
            className="w-full"
            disabled={userListStatus === "loading"}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select User"
            showSearch
            onSelect={(value) => setSelectedUserPhone(value)}
          >
            {!isFromLiveUserBasket &&
              userList?.map((user) => (
                <Option key={user.id} value={user.phone}>
                  {user.full_name || user.phone}
                </Option>
              ))}

            {isFromLiveUserBasket && (
              <Option
                key={userId}
                value={userList?.find((item) => item.id === userId)?.phone}
              >
                {userList?.find((item) => item.id === userId)?.full_name}
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          label="Shipping Address"
          name="shipping_address"
          rules={[
            {
              required: true,
              message: "shipping address is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Shipping Address"
            showSearch
          >
            {userList
              ?.find((user) =>
                !isFromLiveUserBasket
                  ? user.phone === selectedUserPhone
                  : user.id.toString() === userId.toString()
              )
              ?.addresses?.map((address) => (
                <Option
                  key={address.id}
                  value={address.id}
                >{`${address.detail_address}, ${address.area.name} - ${address.city.name}, ${address.province.name}`}</Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-blue-400"
            disabled={onFinish.status === "loading"}
            htmlType="submit"
            size="large"
            type="primary"
            block
          >
            {onFinish.status !== "loading" && <span>Create</span>}
            {onFinish.status === "loading" && <Spin size="small" />}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrder;
