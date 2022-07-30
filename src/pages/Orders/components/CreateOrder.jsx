import { Button, Form, Select, Spin } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../../constants";
import { createOrder, getUserList } from "../../../context/OrdersContext";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CreateShippingModal from "./shared/CreateShippingModal";
import CreateUserModal from "./shared/CreateUserModal";
import UserBasket from "./shared/UserBasket";

const CreateOrder = ({
  // * From Live User Basket
  userId,
}) => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);
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
        user: formValues.user,
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
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFinish.mutate(values)}
      >
        <div className="mt-4 w-full flex justify-between items-center">
          <CustomPageHeader title={"Create New Order"} />

          <Form.Item className="">
            <Button
              className="bg-blue-400"
              disabled={onFinish.status === "loading"}
              htmlType="submit"
              size="large"
              type="primary"
            >
              {onFinish.status !== "loading" && <span>Create Order</span>}
              {onFinish.status === "loading" && <Spin size="small" />}
            </Button>
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={
              <div className="flex gap-3 items-center">
                <span>User</span>
                {userListStatus === "loading" && (
                  <Spin className="mx-3" size="small" />
                )}
                <Button
                  className="p-0 m-0 bg-white"
                  size="small"
                  type="primary"
                  onClick={() => setIsCreateUserOpen(true)}
                >
                  + Add New User
                </Button>
              </div>
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
              {userList?.map((user) => (
                <Option key={user.id} value={user.phone}>
                  {user.full_name || user.phone}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <div className="flex gap-3 items-center">
                <span>Shipping Address</span>
                <Button
                  className="p-0 m-0 bg-white"
                  disabled={!selectedUserPhone}
                  size="small"
                  type="primary"
                  onClick={() => setIsCreateShippingOpen(true)}
                >
                  + Add Shipping Address
                </Button>
              </div>
            }
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
                ?.find((user) => user.phone === selectedUserPhone)
                ?.addresses?.map((address) => (
                  <Option
                    key={address.id}
                    value={address.id}
                  >{`${address.detail_address}, ${address.area.name} - ${address.city.name}, ${address.province.name}`}</Option>
                ))}
            </Select>
          </Form.Item>
        </div>

        {!!selectedUserPhone && (
          <UserBasket
            user={userList?.find((el) => el.phone === selectedUserPhone)}
          />
        )}

        <CreateUserModal
          isCreateUserOpen={isCreateUserOpen}
          setIsCreateUserOpen={setIsCreateUserOpen}
        />

        {!!selectedUserPhone && (
          <CreateShippingModal
            isCreateShippingOpen={isCreateShippingOpen}
            setIsCreateShippingOpen={setIsCreateShippingOpen}
            userId={userList?.find((el) => el.phone === selectedUserPhone)?.id}
          />
        )}
      </Form>
    </>
  );
};

export default CreateOrder;
