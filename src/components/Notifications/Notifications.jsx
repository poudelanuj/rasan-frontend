import { Button, Table } from "antd";
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

  const { data: notifications, status } = useQuery({
    queryFn: () => getNotificationGroups(),
    queryKey: GET_NOTIFICATION_GROUPS,
  });

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
  ];

  return (
    <div className="py-5">
      <ViewNotification
        isOpen={isViewModalOpen}
        notification={selectedNotification}
        onClose={() => {
          setIsViewModalOpen(false);
        }}
      />

      <CreateNotification
        isOpen={isCreateModalOpen}
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
          loading={status === "loading"}
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
