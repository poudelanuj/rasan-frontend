import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import axios from "../../../axios";
import {
  DeleteOutlined,
  HomeOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import { useEffect } from "react";
import { uniqBy, isEmpty } from "lodash";
import {
  addOrderItem,
  deleteOrderItem,
  getOrder,
} from "../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CustomPageHeader from "../../../shared/PageHeader";
import { useState } from "react";
import { getAdminUsers } from "../../../api/users";
import { updateOrder, updateOrderItem } from "../../../api/orders";
import {
  DEFAULT_CARD_IMAGE,
  DELIVERY_STATUS,
  ORDER_INVOICE_URL,
  PAYMENT_STATUS,
} from "../../../constants";
// import getOrderStatusColor from "../../../shared/tagColor";
import ChangePayment from "./shared/ChangePayment";
import { useParams } from "react-router-dom";
import { updateOrderStatus } from "../../../context/OrdersContext";
import { useAuth } from "../../../AuthProvider";
import { getUser } from "../../../context/UserContext";
import rasanDefault from "../../../assets/images/rasan-default.png";
import { getMetaCityAddress } from "../../../api/userAddresses";
import {
  GET_ALL_PRODUCT_SKUS,
  GET_META_CITY_ADDRESS,
} from "../../../constants/queryKeys";
import { getAllProductSkus } from "../../../api/products/productSku";
import MobileViewOrderPage from "./MobileViewOrderPage";

const ViewOrderPage = () => {
  const { userGroupIds, isMobileView } = useAuth();
  const { orderId } = useParams();
  const { Option } = Select;
  const [selectedProductSku, setSelectedSku] = useState();
  const [selectedProductPack, setSelectedPack] = useState();
  const [quantity, setQuantity] = useState(1);
  const [openChangePayment, setOpenChangePayment] = useState(false);

  const [activeOrder, setActiveOrder] = useState({
    orderId: orderId,
    orderStatus: null,
  });

  const [isProductEditableId, setIsProductEditableId] = useState(null);

  const [productPriceEditVal, setProductPriceEditVal] = useState([]);

  const [isVoucherPreviewVisible, setIsVoucherPreviewVisible] = useState(false);

  const [page, setPage] = useState(1);

  const [userList, setUserList] = useState([]);

  let timeout = 0;

  const {
    data,
    status,
    refetch: refetchOrderItems,
    isRefetching,
  } = useQuery({
    queryFn: () => getOrder(orderId),
    queryKey: ["getOrder", orderId],
    enabled: !!orderId,
  });

  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus(),
    queryKey: [GET_ALL_PRODUCT_SKUS],
  });

  const { data: user, status: userStatus } = useQuery({
    queryFn: () => data && getUser(data && data.user_profile_id),
    queryKey: ["get-user", data && data.user],
    enabled: !!data,
  });

  const { data: address } = useQuery({
    queryFn: () => data && getMetaCityAddress(data && data.shipping_address),
    queryKey: [GET_META_CITY_ADDRESS, data && data.shipping_address],
    enabled: !!data,
  });

  const {
    data: dataUser,
    status: usersStatus,
    refetch: refetchUserList,
  } = useQuery({
    queryFn: () => userGroupIds && getAdminUsers(userGroupIds, page, 100, ""),
    queryKey: ["getUserList", userGroupIds, page.toString()],
    enabled: !!userGroupIds,
  });

  useEffect(() => {
    if (dataUser) {
      setUserList((prev) => uniqBy([...prev, ...dataUser.results], "id"));
    }
  }, [dataUser]);

  useEffect(() => {
    refetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAddItem = useMutation(
    () =>
      addOrderItem(orderId, {
        product_pack: selectedProductPack.id,
        number_of_packs: quantity,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchOrderItems();
        // refetchOrders();
        setSelectedPack(null);
      },
    }
  );

  const dataSource = data?.items?.map(
    ({ id, number_of_packs, product_pack }) => {
      const pricePerPiece = product_pack?.price_per_piece;

      const numberOfPacks = number_of_packs;
      const numberOfItemsPerPack = product_pack?.number_of_items;
      const cashbackPerPack =
        product_pack?.loyalty_cashback?.cashback_amount_per_pack;
      const loyaltyPointsPerPack =
        product_pack?.loyalty_cashback?.loyalty_points_per_pack;

      return {
        id,
        productName: product_pack?.product_sku?.name,
        quantity: numberOfPacks,
        packSize: numberOfItemsPerPack,
        price: pricePerPiece,
        total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
        loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
        cashback: cashbackPerPack * numberOfPacks,
        numberOfPacks,
        numberOfItemsPerPack,
      };
    }
  );

  useEffect(() => {
    setProductPriceEditVal(
      data?.items?.map(({ id, product_pack }) => ({
        id,
        price: product_pack?.price_per_piece,
      }))
    );
  }, [data]);

  const handleItemDelete = useMutation(
    (itemId) => deleteOrderItem(orderId, itemId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Deleted");
      },
      onSettled: () => {
        refetchOrderItems();
        // refetchOrders();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const handleItemUpdate = useMutation(
    ({ orderId, itemId, data }) => updateOrderItem({ orderId, itemId, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Updated");
        setIsProductEditableId(null);
      },
      onSettled: () => {
        refetchOrderItems();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const onAssignedToUpdate = useMutation(
    (formValues) =>
      updateOrder(orderId, { assigned_to: formValues["assigned_to"] }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Order Updated");
      },
      onSettled: () => {
        // refetchOrders();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS[0]:
        return "red";
      case PAYMENT_STATUS[1]:
        return "orange";
      default:
        return "green";
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Pack Size",
      dataIndex: "packSize",
      key: "packSize",
    },
    {
      title: "Price (per piece)",
      dataIndex: "price",
      key: "price",
      render: (_, { id }) => (
        <div className="flex items-center">
          <span>Rs.</span>
          <Input
            className={`!bg-inherit !text-black !w-24 ${
              isProductEditableId !== id && "!border-none"
            }`}
            disabled={isProductEditableId !== id}
            id={id}
            name="price"
            value={
              productPriceEditVal?.find((product) => product.id === id)?.price
            }
            onChange={(event) => {
              const { id, name, value } = event.target;
              setProductPriceEditVal((prev) =>
                prev.map((product) => ({
                  ...product,
                  [Number(id) === product.id && name]: value,
                }))
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { id, numberOfItemsPerPack, numberOfPacks }) => (
        <>
          Rs.{" "}
          {productPriceEditVal?.find((product) => product.id === id)?.price *
            numberOfItemsPerPack *
            numberOfPacks}
        </>
      ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
    },
    {
      title: "Cashback",
      dataIndex: "cashback",
      key: "cashback",
      render: (text) => <>Rs. {text}</>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "12%",
      render: (_, { id }) => (
        <div className="inline-flex items-center gap-3">
          <DeleteOutlined
            className="cursor-pointer"
            onClick={() => handleItemDelete.mutate(id)}
          />

          {isProductEditableId === id ? (
            <span className="inline-flex items-center gap-3">
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  handleItemUpdate.mutate({
                    orderId,
                    itemId: isProductEditableId,
                    data: {
                      price_per_piece: productPriceEditVal?.find(
                        (product) => product.id === isProductEditableId
                      )?.price,
                    },
                  })
                }
              >
                Save
              </Button>

              <CloseCircleOutlined
                className="cursor-pointer"
                onClick={() => {
                  setIsProductEditableId(null);
                  setProductPriceEditVal(
                    data?.items?.map(({ id, product_pack }) => ({
                      id,
                      price: product_pack?.price_per_piece,
                    }))
                  );
                }}
              />
            </span>
          ) : (
            <EditOutlined
              className="cursor-pointer"
              onClick={() => setIsProductEditableId(id)}
            />
          )}
        </div>
      ),
    },
  ];

  const getTotalAmount = () => {
    return (
      selectedProductPack?.price_per_piece *
      selectedProductPack?.number_of_items *
      quantity
    );
  };

  const handleUpdateStatus = useMutation(
    (value) =>
      updateOrderStatus({ orderId: activeOrder.orderId, status: value }),
    {
      onSuccess: (data) => {
        setActiveOrder((prev) => ({ ...prev, orderStatus: data.status }));
        refetchOrderItems();
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  // * Will Use This Later 👇
  // eslint-disable-next-line no-unused-vars
  const handleInvoiceDownload = () => {
    try {
      axios
        .get(ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId), {
          responseType: "blob",
        })
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (err) {
      openErrorNotification(err);
    }
  };

  return (
    <>
      <CustomPageHeader title={`Order #${orderId}`} />

      <div className="p-6 rounded-lg bg-[#FFFFFF]">
        <ChangePayment
          isOpen={openChangePayment}
          orderType={data?.type}
          payment={data?.payment}
          onClose={() => setOpenChangePayment(false)}
        />

        {userStatus === "loading" ? (
          <Spin />
        ) : (
          user && (
            <div className="flex sm:flex-row flex-col gap-2 pb-4">
              <img
                alt={user.full_name}
                className="sm:mr-3 sm:h-14 sm:w-14 h-20 w-20 object-cover"
                src={user.profile_picture.thumbnail || rasanDefault}
              />
              <div className="flex flex-col sm:gap-0 gap-2">
                <div className="font-medium text-lg">
                  {user.full_name || "User"}
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-0 gap-2 text-light_text">
                  <div className="flex items-center pr-4">
                    <HomeOutlined className="mr-1" />
                    {user.shop.name}
                  </div>
                  <div className="flex items-center pr-4">
                    <PhoneOutlined className="mr-1" />
                    {user.phone}
                  </div>
                  <div className="flex items-center pr-4">
                    <EnvironmentOutlined className="mr-1" />
                    Delivered at: {address?.name}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        <div className="flex sm:flex-row flex-col sm:!items-center !items-start justify-between w-full">
          <Space className="mb-4" size="middle">
            {/* <Tag color={getOrderStatusColor(data?.status)}>
              {data?.status?.replaceAll("_", " ")?.toUpperCase()}
            </Tag> */}

            <Button type="danger">
              <a
                href={ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId)}
                rel="noreferrer"
                target="_blank"
              >
                Invoice
              </a>
            </Button>

            {data && (
              <>
                <Select
                  className="sm:w-44 w-full"
                  defaultValue={data.status}
                  disabled={handleUpdateStatus.status === "loading"}
                  placeholder="Select Order Status"
                  showSearch
                  onChange={(value) => handleUpdateStatus.mutate(value)}
                >
                  {DELIVERY_STATUS.map(({ name, id }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
                {handleUpdateStatus.status === "loading" && (
                  <Spin size="small" />
                )}
              </>
            )}
          </Space>

          <Form
            className="sm:!w-auto !w-full"
            onFinish={(values) => onAssignedToUpdate.mutate(values)}
          >
            {data && (
              <div className="flex sm:flex-row gap-2 flex-col">
                <Form.Item
                  className="!mb-0"
                  initialValue={data?.assigned_to}
                  label="Assign To"
                  name="assigned_to"
                >
                  <Select
                    className="sm:!w-[300px] w-full"
                    defaultValue={data?.assigned_to}
                    filterOption={false}
                    loading={usersStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Users"
                    showSearch
                    onPopupScroll={() =>
                      data?.next && setPage((prev) => prev + 1)
                    }
                    onSearch={(val) => {
                      if (timeout) clearTimeout(timeout);
                      timeout = setTimeout(async () => {
                        setPage(1);
                        const res = await getAdminUsers(
                          userGroupIds,
                          page,
                          100,
                          val
                        );
                        setUserList([]);
                        setUserList(res.results);
                      }, 200);
                    }}
                  >
                    {userList &&
                      userList.map((user) => (
                        <Option key={user.id} value={user.phone}>
                          {user.full_name
                            ? `${user.full_name} (${user.phone})`
                            : user.phone}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType="submit"
                    loading={onAssignedToUpdate.status === "loading"}
                    type="primary"
                  >
                    SAVE
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form>
        </div>

        {(isRefetching || status === "loading") && (
          <div className="py-8 flex justify-center">
            <Spin />
          </div>
        )}

        {data && data.payment && (
          <Descriptions
            className={"mt-6"}
            column={isMobileView ? 1 : 3}
            title={
              <Space className="w-full flex sm:flex-row flex-col-reverse sm:!items-center !items-start justify-between">
                <div className="inline-flex gap-2 items-center">
                  <span className="font-medium text-base">Order Payment</span>
                  <Button
                    type="primary"
                    onClick={() => setOpenChangePayment((prev) => !prev)}
                  >
                    Change Payment
                  </Button>
                </div>
                <span className="text-gray-500 font-normal text-sm">
                  {moment(data?.created_at).format("ll")}
                </span>
              </Space>
            }
            bordered
          >
            <Descriptions.Item label="Payment Amount" span={1}>
              {data.payment.payment_amount}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status" span={1}>
              <Tag color={getPaymentStatusColor(data.payment.status)}>
                {data.payment.status.replaceAll("_", " ").toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Completed At" span={1}>
              {data.payment.completed_at
                ? moment(data.payment.completed_at).format("ll hh:mm a")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount" span={1}>
              {data.total_amount}
            </Descriptions.Item>
            <Descriptions.Item label="Cashback Applied" span={1}>
              {data.previous_cashback_applied}
            </Descriptions.Item>
            <Descriptions.Item label="Cashback Earned" span={1}>
              {data.total_cashback_earned}
            </Descriptions.Item>
            <Descriptions.Item label="PID" span={3}>
              {data.payment.pid || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="REF ID" span={3}>
              {data.payment.refId || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Voucher Image" span={2}>
              {data.payment.voucher_image ? (
                <div>
                  <span
                    className="text-blue-500 cursor-pointer hover:underline my-0 py-0 transition-all"
                    onClick={() => setIsVoucherPreviewVisible(true)}
                  >
                    View Preview
                  </span>
                  <Image
                    className="hidden"
                    preview={{
                      visible: isVoucherPreviewVisible,
                      onVisibleChange: (visible) =>
                        setIsVoucherPreviewVisible(visible),
                    }}
                    src={data.payment.voucher_image || DEFAULT_CARD_IMAGE}
                    width={150}
                  />
                </div>
              ) : (
                "-"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
        <br />
        <br />

        <h2 className="font-medium text-base mb-5">Order Items</h2>
        {!isRefetching &&
          status === "success" &&
          (isMobileView ? (
            <MobileViewOrderPage
              deleteMutation={(id) => handleItemDelete.mutate(id)}
              orderId={orderId}
              orderItems={dataSource}
              refetchOrderItems={refetchOrderItems}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource || []}
              scroll={{ x: isEmpty(dataSource) && !isMobileView ? null : 1000 }}
            />
          ))}

        <hr className="my-5" />
        <h2 className="font-medium text-base mb-5">Add Item</h2>

        {(handleAddItem.status === "loading" ||
          productsStatus === "loading") && (
          <Spin className="mb-5 flex justify-center" />
        )}

        {handleAddItem.status !== "loading" && productsStatus === "success" && (
          <Form
            className="w-full flex sm:flex-row flex-col !items-start gap-2"
            layout={isMobileView ? "horizontal" : "vertical"}
          >
            <Form.Item
              className="sm:w-auto w-full !mb-0"
              label={!isMobileView && "Product SKU"}
            >
              <Select
                className="sm:!w-[200px]"
                placeholder="Select Product SKU"
                showSearch
                onSelect={(value) => {
                  setSelectedSku(value);
                  setSelectedPack();
                  setQuantity(1);
                }}
              >
                {productSkus &&
                  productSkus.map((item) => (
                    <Select.Option key={item.slug} value={item.slug}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              className="sm:w-auto w-full !mb-0 !flex"
              label={!isMobileView && "Pack Size"}
              tooltip="Select Pack Size"
            >
              <Select
                className="sm:!w-36"
                placeholder="Select Pack Size"
                showSearch
                onSelect={(value) =>
                  setSelectedPack(
                    productSkus &&
                      productSkus
                        .find((item) => item.slug === selectedProductSku)
                        ?.product_packs?.find((pack) => pack.id === value)
                  )
                }
              >
                {productSkus &&
                  productSkus
                    .find((item) => item.slug === selectedProductSku)
                    ?.product_packs?.map((pack) => (
                      <Select.Option key={pack.id} value={pack.id}>
                        {pack.number_of_items}
                      </Select.Option>
                    ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="sm:w-auto w-full relative !mb-0"
              label={!isMobileView && "Quantity"}
              name="quantity"
            >
              <Input
                addonBefore={isMobileView && "Quantity"}
                className="sm:!w-20 "
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
              <span
                className={`${
                  quantity < 0 ? "block" : "hidden"
                } absolute text-xs text-red-600`}
              >
                Negative value not allowed
              </span>
            </Form.Item>

            <Form.Item
              className="sm:w-auto w-full !mb-0"
              label={!isMobileView && "Price Per Piece"}
            >
              <Input
                addonBefore={isMobileView && "Price Per Piece"}
                placeholder="Price"
                type="number"
                value={selectedProductPack?.price_per_piece}
                disabled
              />
            </Form.Item>

            <Form.Item
              className="sm:w-auto w-full !mb-0"
              label={!isMobileView && "Total Amount"}
            >
              <Input
                addonBefore={isMobileView && "Total Amount"}
                placeholder="Total amount"
                type="number"
                value={getTotalAmount()}
                disabled
              />
            </Form.Item>

            <Form.Item
              className="sm:w-auto w-full !mb-0"
              label={!isMobileView && "Loyalty"}
            >
              <Input
                addonBefore={isMobileView && "Loyalty"}
                placeholder="Loyalty points"
                type="number"
                value={
                  parseInt(
                    selectedProductPack?.loyalty_cashback
                      ?.loyalty_points_per_pack,
                    10
                  ) * quantity
                }
                disabled
              />
            </Form.Item>

            <Form.Item
              className="sm:w-auto w-full !mb-0"
              label={!isMobileView && "Cashback"}
            >
              <Input
                addonBefore={isMobileView && "Cashback"}
                placeholder="Cashback"
                type="number"
                value={
                  parseInt(
                    selectedProductPack?.loyalty_cashback
                      ?.cashback_amount_per_pack,
                    10
                  ) * quantity
                }
                disabled
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-blue-500 sm:!mt-[30px]"
                disabled={
                  !(selectedProductPack && selectedProductSku && quantity > 0)
                }
                type="primary"
                onClick={() => handleAddItem.mutate()}
              >
                Add Item
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </>
  );
};

export default ViewOrderPage;
