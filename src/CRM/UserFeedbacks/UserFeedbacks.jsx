import { Breadcrumb, Tabs, Table } from "antd";

const UserFeedbacks = () => {
  const dataSource = [];

  const columns = [
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
      title: "Date",
      dataIndex: "requested_at",
      key: "requested_at",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Ratings",
      dataIndex: "ratings",
      key: "ratings",
    },
  ];

  return (
    <div className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item>CRM</Breadcrumb.Item>
        <Breadcrumb.Item>
          <>User Feedbacks</>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-2xl my-3">User Feedbacks</h2>

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

export default UserFeedbacks;
