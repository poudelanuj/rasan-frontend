import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Spin, Table } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addBasketItem,
  deleteBasketItem,
  getBasketInfo,
  getProductSkus,
} from "../../context/OrdersContext";
import CreateOrder from "../Orders/components/CreateOrder";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";

const BasketModal = ({ isModalOpen, onClose, basket }) => {
  const { user, basket_id } = basket;

  const [openCreateOrder, setOpenCreateOrder] = useState(false);

  // *********** FORM ************ //
  const [selectedProductSku, setSelectedSku] = useState();
  const [selectedProductPack, setSelectedPack] = useState();
  const [quantity, setQuantity] = useState(1);

  const {
    data: basketData,
    refetch: refetchBasketItems,
    isRefetching: isBasketItemsRefetching,
  } = useQuery({
    queryFn: () => getBasketInfo(basket_id),
    queryKey: ["getBasketInfo", basket_id],
    enabled: !!basket_id,
  });

  const dataSource = basketData?.items?.map(
    ({ id, number_of_packs, product_pack, product_sku }) => {
      const productPack = product_sku.product_packs.find(
        (item) => item.id === product_pack
      );

      const pricePerPiece = productPack?.price_per_piece;

      const numberOfPacks = number_of_packs;
      const numberOfItemsPerPack = productPack?.number_of_items;
      const cashbackPerPack =
        productPack?.loyalty_cashback?.cashback_amount_per_pack;
      const loyaltyPointsPerPack =
        productPack?.loyalty_cashback?.loyalty_points_per_pack;

      return {
        id,
        productName: product_sku?.name,
        quantity: numberOfPacks,
        packSize: numberOfItemsPerPack,
        price: pricePerPiece,
        total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
        loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
        cashback: cashbackPerPack * numberOfPacks,
      };
    }
  );

  // *********** FORM ************ //
  const handleItemDelete = useMutation((itemId) => deleteBasketItem(itemId), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Item Deleted");
    },
    onSettled: () => {
      refetchBasketItems();
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

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

  // *********** FORM ************ //
  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getProductSkus(),
    queryKey: ["getProductSkus"],
  });

  // *********** FORM ************ //
  const handleAddItem = useMutation(
    () =>
      addBasketItem({
        product_pack: selectedProductPack.id,
        number_of_packs: quantity,
        basket: basket_id,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchBasketItems();
        setSelectedPack(null);
      },
    }
  );

  // *********** FORM ************ //
  const getTotalAmount = () => {
    return (
      selectedProductPack?.price_per_piece *
      selectedProductPack?.number_of_items *
      quantity
    );
  };

  return (
    <Modal
      footer={[
        <Button
          key="1"
          className="bg-blue-500"
          size="large"
          type="primary"
          onClick={() => setOpenCreateOrder((prev) => !prev)}
        >
          Create Order From Basket
        </Button>,
      ]}
      title={
        <>
          {basket?.user?.full_name || ""} {basket?.user?.phone || ""}
        </>
      }
      visible={isModalOpen}
      width={1000}
      centered
      onCancel={onClose}
    >
      {isBasketItemsRefetching && <Spin className="mb-8 flex justify-center" />}

      {!isBasketItemsRefetching && (
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

      {openCreateOrder && (
        <CreateOrder
          closeModal={() => setOpenCreateOrder(false)}
          isFromLiveUserBasket={true}
          isOpen={openCreateOrder}
          title="Create Order"
          userId={user}
        />
      )}
    </Modal>
  );
};

export default BasketModal;
