import {
  Breadcrumb,
  Tabs,
  Table,
  Rate,
  Dropdown,
  Button,
  Space,
  Menu,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { uniqBy, isEmpty } from "lodash";
import { useMutation, useQuery } from "react-query";
import getAllUserFeedbacks, {
  archiveBulkFeedbacks,
} from "../../../api/crm/userFeedbacks";
import Loader from "../../../shared/Loader";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const UserFeedbacks = () => {
  const [userFeedbacks, setUserFeedbacks] = useState([]);

  const pageSize = 20;

  const [page, setPage] = useState(1);

  const [userFeedbacksIds, setUserFeedbacksIds] = useState([]);

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

  const handleArchiveFeedbacks = useMutation(
    () => archiveBulkFeedbacks(userFeedbacksIds),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        setUserFeedbacksIds([]);
        refetch();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

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

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="change_feedback"
              disabled={isEmpty(userFeedbacksIds)}
              onClick={() => {
                handleArchiveFeedbacks.mutate();
              }}
            >
              Archive
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setUserFeedbacksIds(selectedRows.map((el) => el.id));
    },
  };

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

        <div className="w-full flex justify-between items-center">
          <h2 className="text-2xl my-3">User Feedbacks</h2>

          <Dropdown overlay={bulkMenu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>
        </div>

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
                rowSelection={rowSelection}
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
