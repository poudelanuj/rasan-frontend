import { Button, Modal, Spin, Table } from "antd";
import { useQuery } from "react-query";
import { getOrder } from "../../context/OrdersContext";

const OrderModal = ({ isOpen, closeModal, width, title }) => {
  const { data, status } = useQuery({
    queryFn: () => getOrder(1),
    queryKey: ["getOrder", 1],
  });

  const dataSource = data?.items?.map(({ number_of_packs, product_pack }) => {
    const pricePerPiece = product_pack?.mrp_per_piece;

    const numberOfPacks = number_of_packs;
    const numberOfItemsPerPack = product_pack?.number_of_items;
    const cashbackPerPack =
      product_pack?.loyalty_cashback?.cashback_amount_per_pack;
    const loyaltyPointsPerPack =
      product_pack?.loyalty_cashback?.loyalty_points_per_pack;

    return {
      productName: product_pack?.product_sku?.name,
      quantity: numberOfPacks,
      packSize: numberOfItemsPerPack,
      price: pricePerPiece,
      total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
      loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
      cashback: cashbackPerPack * numberOfPacks,
    };
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
  ];

  return (
    <Modal
      footer={[<Button key={1}>Add Item</Button>]}
      title={title}
      visible={isOpen}
      width={width}
      onCancel={closeModal}
    >
      {status === "loading" && (
        <div className="py-8 flex justify-center">
          <Spin />
        </div>
      )}

      {status === "success" && (
        <Table columns={columns} dataSource={dataSource || []} />
      )}
    </Modal>
  );
};

export default OrderModal;
