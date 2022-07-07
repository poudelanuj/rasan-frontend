import { Breadcrumb, Tabs, Table } from "antd";

const ReturnRequest = () => {
  const dataSource = [];

  const columns = [
    {
      title: "Request ID",
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
      title: "Request Date",
      dataIndex: "requested_at",
      key: "requested_at",
    },
    {
      title: "Return Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item>CRM</Breadcrumb.Item>
        <Breadcrumb.Item>
          <>Return Request</>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-2xl my-3">Return Request</h2>

      <div>
        <Tabs defaultActiveKey="all">
          <Tabs.TabPane key="all" tab="All">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="returned" tab="Returned">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="in-review" tab="In Review">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="rejected" tab="Rejected">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ReturnRequest;
