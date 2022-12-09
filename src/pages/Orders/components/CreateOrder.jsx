import { Form, Select } from "antd";
import { capitalize, uniqBy } from "lodash";
import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../api/users";
import { useAuth } from "../../../AuthProvider";
import {
  DELIVERY_STATUS,
  IN_PROCESS,
  CASH_ON_DELIVERY,
  PAID,
  PAYMENT_METHODS,
  STATUS,
  UNPAID,
} from "../../../constants";
import { createOrder } from "../../../context/OrdersContext";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CreateShippingModal from "./shared/CreateShippingModal";
import CreateUserModal from "./shared/CreateUserModal";
import MobileOrderBasket from "./shared/MobileOrderBasket";
import UserBasket from "./shared/UserBasket";

const CreateOrder = () => {
  const { isMobileView } = useAuth();

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();

  const [selectedUserPhone, setSelectedUserPhone] = useState();
  const [basketItemsStatus, setBasketItemsStatus] = useState(STATUS.idle);
  const [page, setPage] = useState(1);

  const [userList, setUserList] = useState([]);

  const searchRef = useRef("");

  const navigate = useNavigate();

  let timeout = 0;

  const {
    data,
    status: userListStatus,
    refetch: refetchUserList,
    isRefetching: refetchingUserList,
  } = useQuery({
    queryFn: () => getUsers(page, searchRef.current, 100, ["-id"]),
    queryKey: ["getUserList", page.toString()],
  });

  useEffect(() => {
    if (data) setUserList((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const observer = useRef();
  const scrollRef = useCallback(
    (node) => {
      if (userListStatus === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.next) {
          setPage((prev) => prev + 1);
          refetchUserList();
        }
      });
      if (node) observer.current.observe(node);
    },
    [userListStatus, data?.next, refetchUserList]
  );

  const onFinish = useMutation(
    ({
      status: orderStatus,
      payment_method,
      payment_status,
      shipping_address,
      payment_amount,
      user,
      total_cashback_earned,
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
        total_cashback_earned,
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
        layout={isMobileView ? "horizontal" : "vertical"}
        onFinish={(values) => onFinish.mutate(values)}
      >
        <CustomPageHeader title={"Create New Order"} />
        {
          // todo
        }

        <div className="p-6 rounded-lg bg-white">
          <div className="grid sm:grid-cols-2 gap-3">
            <Form.Item
              className="!mb-1"
              label={
                <div className="flex gap-3 items-center">
                  <span>User</span>
                  <ButtonWPermission
                    className="p-0 m-0 bg-white"
                    codename="add_user"
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
                  message: "User required",
                },
              ]}
            >
              <Select
                className="w-full"
                filterOption={false}
                loading={userListStatus === "loading" || refetchingUserList}
                placeholder="Select User"
                showSearch
                onPopupScroll={() => data?.next && setPage((prev) => prev + 1)}
                onSearch={(val) => {
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(async () => {
                    setPage(1);
                    searchRef.current = val;
                    const res = await getUsers(page, val, 100, ["-id"]);
                    setUserList([]);
                    setUserList(res.results);
                  }, 200);
                }}
                onSelect={(value) => {
                  form.setFieldsValue({
                    shipping_address: userList
                      ?.find((user) => user.phone === value)
                      ?.addresses?.find((address) => address.is_default)?.id,
                  });
                  setSelectedUserPhone(value);
                }}
              >
                {userList?.map((user, index) => {
                  const isLastElement = userList?.length === index + 1;
                  return isLastElement ? (
                    <Option key={user.id} ref={scrollRef} value={user.phone}>
                      {user.full_name
                        ? `${user.full_name} (${user.phone})`
                        : user.phone}
                    </Option>
                  ) : (
                    <Option key={user.id} value={user.phone}>
                      {user.full_name
                        ? `${user.full_name} (${user.phone})${
                            user.shop.name ? ` - ${user.shop.name}` : ""
                          }`
                        : `${user.phone}${
                            user.shop.name ? ` - ${user.shop.name}` : ""
                          }`}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              className="!mb-1"
              label={
                <div className="flex gap-3 items-center">
                  <span>Shipping Address</span>
                  <ButtonWPermission
                    className="p-0 m-0 bg-white"
                    codename="add_address"
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
                  message: "Shipping address is required",
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
                showSearch
              >
                {userList &&
                  userList
                    .find((user) => user.phone === selectedUserPhone)
                    ?.addresses?.map((address) => (
                      <Option key={address.id} value={address.id}>{`${
                        address.detail_address || ""
                      } ${address.area?.name} - ${address.city?.name}, ${
                        address.province?.name
                      }`}</Option>
                    ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid sm:grid-cols-3 sm:gap-3 mt-4">
            <Form.Item
              className="!mb-1"
              initialValue={IN_PROCESS}
              label="Order Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Order status is required",
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
                {DELIVERY_STATUS.map(({ name, id }) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="!mb-1"
              initialValue={CASH_ON_DELIVERY}
              label="Payment Method"
              name="payment_method"
              rules={[
                {
                  required: true,
                  message: "Payment method is required",
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
                    {capitalize(item.replaceAll("_", " "))}
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
                  message: "Payment status is required",
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

          {!!selectedUserPhone &&
            userList &&
            userList.find((el) => el.phone === selectedUserPhone) &&
            (isMobileView ? (
              <MobileOrderBasket
                setBasketItemsStatus={setBasketItemsStatus}
                user={userList.find((el) => el.phone === selectedUserPhone)}
              />
            ) : (
              <UserBasket
                setBasketItemsStatus={setBasketItemsStatus}
                user={userList.find((el) => el.phone === selectedUserPhone)}
              />
            ))}

          <div className="w-full flex justify-end">
            <ButtonWPermission
              codename="add_order"
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
            form={form}
            isCreateUserOpen={isCreateUserOpen}
            refetchUserList={refetchUserList}
            setIsCreateUserOpen={setIsCreateUserOpen}
            setSelectedUserPhone={setSelectedUserPhone}
            setUserList={setUserList}
          />

          {!!selectedUserPhone && (
            <CreateShippingModal
              form={form}
              isCreateShippingOpen={isCreateShippingOpen}
              refetchUserList={refetchUserList}
              setIsCreateShippingOpen={setIsCreateShippingOpen}
              setUserList={setUserList}
              userId={
                userList?.find((el) => el.phone === selectedUserPhone)?.id
              }
            />
          )}
        </div>
      </Form>
    </>
  );
};

export default CreateOrder;
