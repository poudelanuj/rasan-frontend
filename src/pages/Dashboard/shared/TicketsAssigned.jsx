import { Table, Tag } from "antd";
import moment from "moment";
import { getStatusColor } from "../../CRM/shared/getTicketStatusColor";

const TicketsAssigned = ({ tickets, status }) => {
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <>#{text}</>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Customer Name",
      dataIndex: "initiator.full_name",
      key: "full_name",
      render: (_, { initiator }) => initiator?.full_name,
    },
    {
      title: "Phone Number",
      dataIndex: "initiator.phone",
      key: "phone",
      render: (_, { initiator }) => initiator?.phone,
    },
    {
      title: "Issue Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
      render: (_, { assigned_to }) => assigned_to?.full_name || "",
    },
    {
      title: "Ticket Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag className="uppercase" color={getStatusColor(status)}>
          {status.replaceAll("_", " ")}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tickets?.map((item) => ({ ...item, key: item.id }))}
        loading={status === "loading"}
      />
    </>
  );
};

export default TicketsAssigned;
