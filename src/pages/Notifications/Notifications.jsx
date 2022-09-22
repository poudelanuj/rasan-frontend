import { Button, Table } from "antd";
import { uniqBy } from "lodash";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { getNotificationGroups } from "../../api/notifications";
import { GET_NOTIFICATION_GROUPS } from "../../constants/queryKeys";
import CreateNotification from "./CreateNotification";
import ViewNotification from "./ViewNotification";

const Notifications = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNotification, setSelected] = useState();
  const [notifications, setNotifications] = useState([]);

  const pageSize = 20;
  const [page, setPage] = useState(1);

  const {
    data,
    status,
    refetch: refetchNotifications,
    isRefetching,
  } = useQuery({
    queryFn: () => getNotificationGroups(page, pageSize),
    queryKey: [GET_NOTIFICATION_GROUPS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setNotifications([]);
      setNotifications((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns = [
    {
      title: "S.No",
      dataIndex: "sn",
      key: "sn",
      render: (text) => <>#{text}</>,
    },
    {
      title: "Notification Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text.replaceAll("_", " ").toUpperCase(),
    },
    {
      title: "Total Notification Sent",
      dataIndex: "sent_count",
      key: "sent_count",
      render: (_, { metrics }) => metrics?.sent_count,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => (
        <>{moment(created_at).format("ll hh:mm a")}</>
      ),
    },
  ];

  return (
    <div className="py-5">
      <ViewNotification
        isOpen={isViewModalOpen}
        notification={selectedNotification}
        refetchNotifications={refetchNotifications}
        onClose={() => {
          setIsViewModalOpen(false);
        }}
      />

      <CreateNotification
        isOpen={isCreateModalOpen}
        refetchNotifications={refetchNotifications}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Notifications</h2>
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create New Notification
        </Button>
      </div>
      <div className="my-5">
        <Table
          columns={columns}
          dataSource={notifications?.map((item, index) => ({
            ...item,
            key: item.id,
            sn: index + 1,
          }))}
          loading={status === "loading" || isRefetching}
          pagination={{
            pageSize,
            total: data?.count,

            onChange: (page, pageSize) => {
              setPage(page);
            },
          }}
          rowClassName="cursor-pointer"
          onRow={(record) => {
            return {
              onClick: () => {
                setIsViewModalOpen(true);
                setSelected(record);
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default Notifications;
