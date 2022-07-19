import { Table, Tag } from "antd";
import moment from "moment";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../../constants";

const OrdersAssigned = ({ orders, status }) => {
  const getTagColor = (status) => {
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "orderId",
      render: (_, { id, status }) => {
        return <div className="">#{id}</div>;
      },
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: (_, { user }) => {
        return <>{user}</>;
      },
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_paid_amount",
      key: "total_paid_amount",
      render: (_, { total_paid_amount }) => {
        return <>Rs. {total_paid_amount}</>;
      },
      sorter: (a, b) => a.total_paid_amount - b.total_paid_amount,
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <>
            <Tag color={getTagColor(status)}>
              {status.toUpperCase().replaceAll("_", " ")}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
      render: (_, { payment }) => {
        return <>{payment?.payment_method?.replaceAll("_", " ")}</>;
      },
    },
    {
      title: "Ordered At",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
      sorter: (a, b) => a.created_at - b.created_at,
    },
  ];

  return (
    <div className="">
      <Table
        columns={columns}
        dataSource={orders?.map((item) => ({ ...item, key: item.id }))}
        loading={status === "loading"}
      />
    </div>
  );
};

export default OrdersAssigned;
