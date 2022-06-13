import { Table, Tag } from "antd";
import moment from "moment";

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "ordderId",
    render: (_, { orderId }) => {
      return <div className="text-blue-500">#{orderId}</div>;
    },
    sorter: (a, b) => a.orderId - b.orderId,
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    sorter: (a, b) => a.customer.localeCompare(b.customer),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (_, { price }) => {
      return <>Rs. {price}</>;
    },
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Delivery Status",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => {
      const getTagColor = () => {
        switch (status) {
          case "in progress":
            return "orange";
          case "cancelled":
            return "red";
          case "delivered":
            return "green";
          default:
            return "green";
        }
      };
      return (
        <>
          <Tag color={getTagColor()}>{status.toUpperCase()}</Tag>
        </>
      );
    },
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Delivery Date",
    dataIndex: "deliveryDate",
    key: "deliveryDate",
    render: (_, { deliveryDate }) => {
      return <>{moment(deliveryDate).format("ll")}</>;
    },
    sorter: (a, b) => a.deliveryDate - b.deliveryDate,
  },
];

const OrdersList = ({ dataSource }) => {
  return <Table columns={columns} dataSource={dataSource} />;
};

export default OrdersList;
