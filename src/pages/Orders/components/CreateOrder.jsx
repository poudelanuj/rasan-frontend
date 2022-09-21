import { Form, Select } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../api/users";
import {
  CANCELLED,
  CASH_ON_DELIVERY,
  DELIVERED,
  IN_PROCESS,
  PAID,
  PAYMENT_METHODS,
  STATUS,
  UNPAID,
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
import ButtonWPermission from "../../../shared/ButtonWPermission";

const CreateOrder = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedUserPhone, setSelectedUserPhone] = useState(0);
  const [basketItemsStatus, setBasketItemsStatus] = useState(STATUS.idle);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  const navigate = useNavigate();

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
        navigate(`/orders/view-order/${data.data.id}`);
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
                <ButtonWPermission
                  className="p-0 m-0 bg-white"
                  codeName="add_user"
                  size="small"
                  type="primary"
                  onClick={() => setIsCreateUserOpen(true)}
                >
                  + Add New User
                </ButtonWPermission>
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
                  {user.full_name
                    ? `${user.full_name} (${user.phone})`
                    : user.phone}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <div className="flex gap-3 items-center">
                <span>Shipping Address</span>
                <ButtonWPermission
                  className="p-0 m-0 bg-white"
                  codeName="add_address"
                  disabled={!selectedUserPhone}
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
                message: "shipping address is required",
              },
            ]}
          >
            <Select
              className="w-full"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              loading={userListStatus === "loading" || refetchingUserList}
              optionFilterProp="children"
              placeholder="Select Shipping Address"
              value={selectedShippingAddress}
              showSearch
              onSelect={(value) => setSelectedShippingAddress(value)}
            >
              {userList
                ?.find((user) => user.phone === selectedUserPhone)
                ?.addresses?.map((address) => (
                  <Option key={address.id} value={address.id}>{`${
                    address.detail_address || ""
                  } ${address.area.name} - ${address.city.name}, ${
                    address.province.name
                  }`}</Option>
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

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Form.Item
            initialValue={IN_PROCESS}
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
              defaultValue={IN_PROCESS}
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
            initialValue={CASH_ON_DELIVERY}
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
              defaultValue={CASH_ON_DELIVERY}
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
            initialValue={UNPAID}
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
              defaultValue={UNPAID}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              optionFilterProp="children"
              placeholder="Select Payment Status"
              showSearch
            >
              <Option value={UNPAID}>Unpaid</Option>
              <Option value={PAID}>Paid</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="w-full flex justify-end">
          <ButtonWPermission
            codeName="add_order"
            disabled={
              onFinish.status === "loading" ||
              basketItemsStatus === STATUS.processing
            }
            htmlType="submit"
            loading={onFinish.status === "loading"}
            size="large"
            type="primary"
          >
            {basketItemsStatus === STATUS.processing
              ? "Please save basket items to create order"
              : "Create Order"}
          </ButtonWPermission>
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
            setSelectedShippingAddress={setSelectedShippingAddress}
            userId={userList?.find((el) => el.phone === selectedUserPhone)?.id}
          />
        )}
      </Form>
    </>
  );
};

export default CreateOrder;
