import { Table, Tag } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getAllNotifications } from "../../api/notifications";
import { GET_NOTIFICATIONS } from "../../constants/queryKeys";
import ViewNotification from "./ViewNotification";

const Notifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelected] = useState();

  const { data: notifications, status } = useQuery({
    queryFn: () => getAllNotifications(),
    queryKey: GET_NOTIFICATIONS,
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => text.replaceAll("_", " ").toUpperCase(),
    },
    {
      title: "Seen",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) =>
        status ? <Tag color="green">YES</Tag> : <Tag color="orange">NO</Tag>,
    },
    {
      title: "Total Notification Sent",
      dataIndex: "total_notification",
      key: "total_notification",
    },
  ];

  return (
    <div className="py-5">
      <ViewNotification
        isOpen={isModalOpen}
        notification={selectedNotification}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />

      <h2 className="text-2xl">Notifications</h2>
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
                setIsModalOpen(true);
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
