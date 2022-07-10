import { Breadcrumb, Tabs, Table, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import getAllTickets from "../../api/crm/tickets";
import { TICKET_TYPE_RETURN } from "../../constants";

import Loader from "../../shared/Loader";
import { getStatusColor } from "../shared/getTicketStatusColor";

const ReturnRequestList = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);

  const { data: ticketsList, status } = useQuery({
    queryFn: () => getAllTickets(),
    queryKey: ["get-all-tickets"],
  });

  useEffect(() => {
    setTickets(
      ticketsList
        ?.filter((item) => item.type === TICKET_TYPE_RETURN)
        ?.map((item, index) => ({
          ...item,
          key: item.id || item.slug || index,
        }))
    );
  }, [ticketsList]);

  const columns = [
    {
      title: "Return Request ID",
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
      key: "initiator.phone",
      render: (_, { initiator }) => initiator?.phone,
    },
    {
      title: "Requested Date",
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
      title: "Return Status",
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
            <>Return Request</>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl my-3">Return Request</h2>
          <Button type="primary" onClick={() => navigate("create")}>
            Create Return Ticket
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
                      navigate(`/crm/return-request/${record.id}`);
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
                      navigate(`/crm/return-request/${record.id}`);
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
                      navigate(`/crm/return-request/${record.id}`);
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
                      navigate(`/crm/return-request/${record.id}`);
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
                      navigate(`/crm/return-request/${record.id}`);
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

export default ReturnRequestList;
