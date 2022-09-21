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
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { useQuery } from "react-query";
import moment from "moment";
import { saveAs } from "file-saver";
import {
  addOrderItem,
  deleteOrderItem,
  getOrder,
  getProductSkus,
} from "../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CustomPageHeader from "../../../shared/PageHeader";
import { useState } from "react";
import { getUsers } from "../../../api/users";
import {
  GET_CANCELLED_ORDER,
  GET_DELIVERED_ORDER,
  GET_INPROCESS_ORDER,
  GET_ORDERS,
  GET_USERS,
} from "../../../constants/queryKeys";
import { updateOrder } from "../../../api/orders";
import {
  DEFAULT_CARD_IMAGE,
  ORDER_INVOICE_URL,
  PAYMENT_STATUS,
} from "../../../constants";
import ChangePayment from "./shared/ChangePayment";
import { useParams } from "react-router-dom";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../../constants";
import { updateOrderStatus } from "../../../context/OrdersContext";
import axios from "../../../axios";

export const getOrderStatusColor = (status) => {
  switch (status) {
    case IN_PROCESS:
      return "orange";
    case CANCELLED:
      return "red";
    case DELIVERED:
      return "green";
    default:
      return "green";
  }
};

const ViewOrderPage = () => {
  const queryClient = useQueryClient();
  const { orderId } = useParams();
  const [selectedProductSku, setSelectedSku] = useState();
  const [selectedProductPack, setSelectedPack] = useState();
  const [quantity, setQuantity] = useState(1);
  const [openChangePayment, setOpenChangePayment] = useState(false);

  const [activeOrder, setActiveOrder] = useState({
    orderId: orderId,
    orderStatus: null,
  });

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
    queryFn: () => getProductSkus(),
    queryKey: ["getProductSkus"],
  });

  const { data: usersList, status: usersStatus } = useQuery({
    queryFn: () => getUsers(),
    queryKey: [GET_USERS],
  });

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
        queryClient.refetchQueries([GET_ORDERS]);
        queryClient.refetchQueries([GET_INPROCESS_ORDER]);
        queryClient.refetchQueries([GET_DELIVERED_ORDER]);
        queryClient.refetchQueries([GET_CANCELLED_ORDER]);
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
      };
    }
  );

  const handleItemDelete = useMutation(
    (itemId) => deleteOrderItem(orderId, itemId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Deleted");
      },
      onSettled: () => {
        refetchOrderItems();
        // refetchOrders();
        queryClient.refetchQueries([GET_ORDERS]);
        queryClient.refetchQueries([GET_INPROCESS_ORDER]);
        queryClient.refetchQueries([GET_DELIVERED_ORDER]);
        queryClient.refetchQueries([GET_CANCELLED_ORDER]);
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
        refetchOrderItems();
        // refetchOrders();
        queryClient.refetchQueries([GET_ORDERS]);
        queryClient.refetchQueries([GET_INPROCESS_ORDER]);
        queryClient.refetchQueries([GET_DELIVERED_ORDER]);
        queryClient.refetchQueries([GET_CANCELLED_ORDER]);
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <>Rs. {text}/pc</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <>Rs. {text}</>,
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
      render: (_, { id }) => (
        <div>
          <DeleteOutlined
            className="mx-3"
            onClick={() => handleItemDelete.mutate(id)}
          />
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
        // refetchOrders();
        queryClient.refetchQueries([GET_ORDERS]);
        queryClient.refetchQueries([GET_INPROCESS_ORDER]);
        queryClient.refetchQueries([GET_DELIVERED_ORDER]);
        queryClient.refetchQueries([GET_CANCELLED_ORDER]);
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  // * Will Use This Later 👇
  // eslint-disable-next-line no-unused-vars
  const handleInvoiceDownload = () => {
    axios
      .get(ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId), {
        responseType: "blob",
      })
      .then((res) => {
        saveAs(res.data, `invoice_order_${orderId}`);
      });
  };

  return (
    <>
      <CustomPageHeader title={`Order #${orderId}`} />

      <div className="p-5 bg-[#FFFFFF]">
        <ChangePayment
          isOpen={openChangePayment}
          orderType={data?.type}
          payment={data?.payment}
          onClose={() => setOpenChangePayment(false)}
        />

        <div className="flex justify-between items-center">
          <Space className="mb-4" size="middle">
            {/* <Tag color={getOrderStatusColor(data?.status)}>
              {data?.status?.replaceAll("_", " ")?.toUpperCase()}
            </Tag> */}

            <Button type="danger">
              <a
                href={ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId)}
                target="__blank"
                download
              >
                Invoice
              </a>
            </Button>

            {data && (
              <>
                <Select
                  className="mx-5"
                  defaultValue={data.status}
                  disabled={handleUpdateStatus.status === "loading"}
                  placeholder="Select Order Status"
                  showSearch
                  onChange={(value) => handleUpdateStatus.mutate(value)}
                >
                  <Select.Option value={IN_PROCESS}>In Process</Select.Option>
                  <Select.Option value={CANCELLED}>Cancelled</Select.Option>
                  <Select.Option value={DELIVERED}>Delivered</Select.Option>
                </Select>
                {handleUpdateStatus.status === "loading" && (
                  <Spin size="small" />
                )}
              </>
            )}
          </Space>

          <Form onFinish={(values) => onAssignedToUpdate.mutate(values)}>
            <Space>
              {data && (
                <>
                  <Form.Item
                    initialValue={data?.assigned_to}
                    label="Assign To"
                    name="assigned_to"
                  >
                    <Select
                      defaultValue={data?.assigned_to}
                      loading={usersStatus === "loading"}
                      mode="multiple"
                      placeholder="Select Users"
                      style={{ width: 300 }}
                      showSearch
                    >
                      {usersList &&
                        usersList.map((user) => (
                          <Select.Option key={user.id} value={user.phone}>
                            {user.full_name || user.phone}
                          </Select.Option>
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
                </>
              )}
            </Space>
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
            column={3}
            title={
              <Space className="w-full flex justify-between items-center">
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
            <Descriptions.Item label="PID" span={3}>
              {data.payment.pid || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="REF ID" span={3}>
              {data.payment.refId || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Voucher Image" span={2}>
              {data.voucher_image ? (
                <Image
                  src={data.voucher_image || DEFAULT_CARD_IMAGE}
                  width={200}
                />
              ) : (
                "-"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
        <br />
        <br />

        <h2 className="font-medium text-base mb-5">Order Items</h2>
        {!isRefetching && status === "success" && (
          <Table columns={columns} dataSource={dataSource || []} />
        )}

        <hr className="my-5" />
        <h2 className="font-medium text-base mb-5">Add Item</h2>

        {(handleAddItem.status === "loading" ||
          productsStatus === "loading") && (
          <Spin className="mb-5 flex justify-center" />
        )}

        {handleAddItem.status !== "loading" && productsStatus === "success" && (
          <Form layout="horizontal">
            <Space>
              <Form.Item>
                <span>Product Sku</span>
                <Select
                  placeholder="Select Product SKU"
                  style={{ width: 200 }}
                  showSearch
                  onSelect={(value) => setSelectedSku(value)}
                >
                  {productSkus &&
                    productSkus.map((item) => (
                      <Select.Option key={item.slug} value={item.slug}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item tooltip="Select Pack Size">
                <span>Pack Size</span>
                <Select
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

              <Form.Item name="quantity">
                <span>Quantity</span>
                <Input
                  placeholder="quantity"
                  type="number"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item>
                <span>Price Per Piece</span>
                <Input
                  placeholder="price"
                  type="number"
                  value={selectedProductPack?.price_per_piece}
                  disabled
                />
              </Form.Item>

              <Form.Item>
                <span>Total Amount</span>
                <Input
                  placeholder="total amount"
                  type="number"
                  value={getTotalAmount()}
                  disabled
                />
              </Form.Item>

              <Form.Item>
                <span>Loyalty</span>
                <Input
                  placeholder="loyalty points"
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

              <Form.Item>
                <span>Cashback</span>
                <Input
                  placeholder="cashback"
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
                <div style={{ height: 20 }} />
                <Button
                  className="bg-blue-500"
                  type="primary"
                  onClick={() => handleAddItem.mutate()}
                >
                  Add Item
                </Button>
              </Form.Item>
            </Space>
          </Form>
        )}
      </div>
    </>
  );
};

export default ViewOrderPage;
