import { Table } from "antd";
import { getOrders } from "../mock/orders";

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "ordderId",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Delivery Status",
    dataIndex: "status",
    key: "status",
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
  },
];

const OrdersList = () => {
  const dataSource = getOrders(20);

  return <Table columns={columns} dataSource={dataSource} />;
};

export default OrdersList;
