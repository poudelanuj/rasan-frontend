import { Breadcrumb, Tabs, Table, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import getAllTickets from "../../api/crm/tickets";
import { TICKET_TYPE_GENERAL, TICKET_TYPE_OTHER } from "../../constants";

import Loader from "../../shared/Loader";
import { getStatusColor } from "../shared/getTicketStatusColor";

const SupportTicketList = () => {
  const navigate = useNavigate();
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
      {status === "loading" && <Loader isOpen />}

      <div className="py-4">
        <Breadcrumb>
          <Breadcrumb.Item>CRM</Breadcrumb.Item>
          <Breadcrumb.Item>
            <>Support Ticket</>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl my-3">Support Ticket</h2>
          <Button type="primary" onClick={() => navigate("create")}>
            Create Support Ticket
          </Button>
        </div>

        <div>
          <Tabs defaultActiveKey="all">
            <Tabs.TabPane key="all" tab="All">
              <Table
                columns={columns}
                dataSource={tickets}
                rowClassName="cursor-pointer"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`${record.id}`);
                    },
                  };
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="new" tab="New">
              <Table
                columns={columns}
                dataSource={tickets?.filter((item) => item.status === "new")}
                rowClassName="cursor-pointer"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`${record.id}`);
                    },
                  };
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="processing" tab="Processing">
              <Table
                columns={columns}
                dataSource={tickets?.filter(
                  (item) => item.status === "processing"
                )}
                rowClassName="cursor-pointer"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`${record.id}`);
                    },
                  };
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="closed" tab="Closed">
              <Table
                columns={columns}
                dataSource={tickets?.filter((item) => item.status === "closed")}
                rowClassName="cursor-pointer"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`${record.id}`);
                    },
                  };
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="on_hold" tab="On Hold">
              <Table
                columns={columns}
                dataSource={tickets?.filter(
                  (item) => item.status === "on_hold"
                )}
                rowClassName="cursor-pointer"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`${record.id}`);
                    },
                  };
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SupportTicketList;
