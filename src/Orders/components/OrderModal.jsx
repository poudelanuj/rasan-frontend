import { Button, Form, Input, Modal, Select, Space, Spin, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import moment from "moment";
import {
  addOrderItem,
  deleteOrderItem,
  getOrder,
  getProductSkus,
} from "../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import { useState } from "react";

const OrderModal = ({
  isOpen,
  closeModal,
  width,
  title,
  orderId,
  orderedAt,
  refetchOrders,
}) => {
  const [selectedProductSku, setSelectedSku] = useState();
  const [selectedProductPack, setSelectedPack] = useState();
  const [quantity, setQuantity] = useState(1);

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
        refetchOrders();
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
        refetchOrders();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

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

  return (
    <Modal
      footer={false}
      title={title}
      visible={isOpen}
      width={width}
      onCancel={closeModal}
    >
      <div className="text-gray-500 mb-4">{moment(orderedAt).format("ll")}</div>

      {(isRefetching || status === "loading") && (
        <div className="py-8 flex justify-center">
          <Spin />
        </div>
      )}

      {!isRefetching && status === "success" && (
        <Table columns={columns} dataSource={dataSource || []} />
      )}

      <hr className="my-5" />
      <h2 className="font-medium text-base mb-5">Add Item</h2>

      {(handleAddItem.status === "loading" || productsStatus === "loading") && (
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
                    <Select.Option key={item.sn} value={item.sn}>
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
                        .find((item) => item.sn === selectedProductSku)
                        ?.product_packs?.find((pack) => pack.sn === value)
                  )
                }
              >
                {productSkus &&
                  productSkus
                    .find((item) => item.sn === selectedProductSku)
                    ?.product_packs?.map((pack) => (
                      <Select.Option key={pack.sn} value={pack.sn}>
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
    </Modal>
  );
};

export default OrderModal;
