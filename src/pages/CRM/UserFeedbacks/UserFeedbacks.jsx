import { Breadcrumb, Tabs, Table, Rate } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import { useQuery } from "react-query";
import getAllUserFeedbacks from "../../../api/crm/userFeedbacks";
import Loader from "../../../shared/Loader";

const UserFeedbacks = () => {
  const [userFeedbacks, setUserFeedbacks] = useState([]);

  const pageSize = 20;

  const [page, setPage] = useState(1);

  const [isArchived, setIsArchived] = useState(false);

  const { data, refetch, status } = useQuery({
    queryFn: () => getAllUserFeedbacks({ isArchived, page, pageSize }),
    queryKey: ["get-all-user-feedbacks", page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setUserFeedbacks([]);
      setUserFeedbacks((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isArchived]);

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
          <Tabs
            defaultActiveKey="all"
            onTabClick={(tabKey) => setIsArchived(tabKey === "archived")}
          >
            <Tabs.TabPane key="all" tab="All" on>
              <Table
                columns={columns}
                dataSource={userFeedbacks}
                pagination={{
                  pageSize,
                  total: data?.count,

                  onChange: (page, pageSize) => {
                    setPage(page);
                  },
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="archived" tab="Archived">
              <Table
                columns={columns}
                dataSource={userFeedbacks}
                pagination={{
                  pageSize,
                  total: data?.count,

                  onChange: (page, pageSize) => {
                    setPage(page);
                  },
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserFeedbacks;
