import { Button, Modal, Spin, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import moment from "moment";
import { deleteOrderItem, getOrder } from "../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";

const OrderModal = ({
  isOpen,
  closeModal,
  width,
  title,
  orderId,
  orderedAt,
}) => {
  const { data, status, refetch, isRefetching } = useQuery({
    queryFn: () => getOrder(orderId),
    queryKey: ["getOrder", orderId],
    enabled: !!orderId,
  });

  const dataSource = data?.items?.map(
    ({ id, number_of_packs, product_pack }) => {
      const pricePerPiece = product_pack?.mrp_per_piece;

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
        console.log(data);
        openSuccessNotification(data.message || "Item Deleted");
      },
      onSettled: () => {
        refetch();
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

  return (
    <Modal
      footer={[<Button key={1}>Add Item</Button>]}
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
    </Modal>
  );
};

export default OrderModal;
