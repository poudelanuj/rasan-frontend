import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { getUsers } from "../../../api/users";
import {
  CANCELLED,
  DELIVERED,
  IN_PROCESS,
  PAYMENT_METHODS,
  STATUS,
} from "../../../constants";
import { createOrder } from "../../../context/OrdersContext";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CreateShippingModal from "./shared/CreateShippingModal";
import CreateUserModal from "./shared/CreateUserModal";
import UserBasket from "./shared/UserBasket";

const CreateOrder = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedUserPhone, setSelectedUserPhone] = useState(0);
  const [basketItemsStatus, setBasketItemsStatus] = useState(STATUS.idle);

  const {
    data: userList,
    status: userListStatus,
    refetch: refetchUserList,
    isRefetching: refetchingUserList,
  } = useQuery({
    queryFn: () => getUsers(),
    queryKey: ["getUserList"],
  });

  const onFinish = useMutation(
    ({
      status: orderStatus,
      payment_method,
      payment_status,
      shipping_address,
      payment_amount,
      user,
    }) =>
      createOrder({
        status: orderStatus,
        payment: {
          payment_method,
          payment_amount,
          status: payment_status,
        },
        user,
        shipping_address,
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={
              <div className="flex gap-3 items-center">
                <span>User</span>
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
              loading={userListStatus === "loading" || refetchingUserList}
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
            setBasketItemsStatus={setBasketItemsStatus}
            user={userList?.find((el) => el.phone === selectedUserPhone)}
          />
        )}

        <div className="grid grid-cols-4 gap-3 mt-4">
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
              {PAYMENT_METHODS.map((item) => (
                <Option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </Option>
              ))}
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
            label="Payment Amount"
            name="payment_amount"
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </div>

        <div className="w-full flex justify-end">
          <Button
            disabled={
              onFinish.status === "loading" ||
              basketItemsStatus === STATUS.processing
            }
            loading={onFinish.status === "loading"}
            size="large"
            type="primary"
          >
            {basketItemsStatus === STATUS.processing
              ? "Please save basket items to create order"
              : "Create Order"}
          </Button>
        </div>

        <CreateUserModal
          isCreateUserOpen={isCreateUserOpen}
          refetchUserList={refetchUserList}
          setIsCreateUserOpen={setIsCreateUserOpen}
        />

        {!!selectedUserPhone && (
          <CreateShippingModal
            isCreateShippingOpen={isCreateShippingOpen}
            refetchUserList={refetchUserList}
            setIsCreateShippingOpen={setIsCreateShippingOpen}
            userId={userList?.find((el) => el.phone === selectedUserPhone)?.id}
          />
        )}
      </Form>
    </>
  );
};

export default CreateOrder;
