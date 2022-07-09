import { Breadcrumb, Tabs, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import getAllTickets from "../../api/crm/tickets";
import { TICKET_TYPE_GENERAL, TICKET_TYPE_OTHER } from "../../constants";

import Loader from "../../shared/Loader";
import { getStatusColor } from "../shared/getTicketStatusColor";

const SupportTicket = () => {
  const [tickets, setTickets] = useState([]);

  const { data: ticketsList, status } = useQuery({
    queryFn: () => getAllTickets(),
    queryKey: ["get-all-tickets"],
  });

  useEffect(() => {
    setTickets(
      ticketsList
        ?.filter(
          (item) =>
            item.type === TICKET_TYPE_OTHER || item.type === TICKET_TYPE_GENERAL
        )
        ?.map((item, index) => ({
          ...item,
          key: item.id || item.slug || index,
        }))
    );
  }, [ticketsList]);

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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
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
    },
    {
      title: "Ticket Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <>
      {status === "loading" && <Loader isOpen />}

      <div className="py-4">
        <Breadcrumb>
          <Breadcrumb.Item>CRM</Breadcrumb.Item>
          <Breadcrumb.Item>
            <>Support Ticket</>
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="text-2xl my-3">Support Ticket</h2>

        <div>
          <Tabs defaultActiveKey="all">
            <Tabs.TabPane key="all" tab="All">
              <Table
                columns={columns}
                dataSource={tickets}
                rowClassName="cursor-pointer"
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="new" tab="New">
              <Table
                columns={columns}
                dataSource={tickets?.filter((item) => item.status === "new")}
                rowClassName="cursor-pointer"
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="processing" tab="Processing">
              <Table
                columns={columns}
                dataSource={tickets?.filter(
                  (item) => item.status === "processing"
                )}
                rowClassName="cursor-pointer"
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="closed" tab="Closed">
              <Table
                columns={columns}
                dataSource={tickets?.filter((item) => item.status === "closed")}
                rowClassName="cursor-pointer"
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="on_hold" tab="On Hold">
              <Table
                columns={columns}
                dataSource={tickets?.filter(
                  (item) => item.status === "on_hold"
                )}
                rowClassName="cursor-pointer"
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SupportTicket;
