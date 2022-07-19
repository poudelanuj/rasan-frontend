import { Breadcrumb, Tabs, Table, Rate } from "antd";
import moment from "moment";
import { useQuery } from "react-query";
import getAllUserFeedbacks from "../../../api/crm/userFeedbacks";
import Loader from "../../../shared/Loader";

const UserFeedbacks = () => {
  const { data: userFeedbacks, status } = useQuery({
    queryFn: () => getAllUserFeedbacks(),
    queryKey: ["get-all-user-feedbacks"],
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Phone Number",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
    },
    {
      title: "Feedback",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Ratings",
      dataIndex: "stars",
      key: "stars",
      render: (_, { stars }) => (
        <Rate defaultValue={stars} allowHalf disabled />
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
            <>User Feedbacks</>
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="text-2xl my-3">User Feedbacks</h2>

        <div>
          <Tabs defaultActiveKey="all">
            <Tabs.TabPane key="all" tab="All">
              <Table columns={columns} dataSource={userFeedbacks} />
            </Tabs.TabPane>
            <Tabs.TabPane key="archived" tab="Archived">
              <Table columns={columns} dataSource={userFeedbacks} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserFeedbacks;
