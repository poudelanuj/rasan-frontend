import { Breadcrumb, Tabs, Table } from "antd";

const SupportTicket = () => {
  const dataSource = [];

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
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
      dataIndex: "issued_at",
      key: "issued_at",
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
    },
  ];

  return (
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
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="open" tab="Open">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="in-progress" tab="In Progress">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="closed" tab="Closed">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default SupportTicket;
