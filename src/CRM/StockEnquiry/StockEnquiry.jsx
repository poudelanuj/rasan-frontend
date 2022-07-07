import { Breadcrumb, Tabs, Table } from "antd";

const StockEnquiry = () => {
  const dataSource = [];

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Enquiry Date",
      dataIndex: "requested_at",
      key: "requested_at",
    },
  ];

  return (
    <div className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item>CRM</Breadcrumb.Item>
        <Breadcrumb.Item>
          <>Stock Enquiry</>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-2xl my-3">Out of Stock Enquiry</h2>

      <div>
        <Tabs defaultActiveKey="all">
          <Tabs.TabPane key="all" tab="All">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
          <Tabs.TabPane key="archived" tab="Archived">
            <Table columns={columns} dataSource={dataSource} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default StockEnquiry;
