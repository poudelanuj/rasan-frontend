import {
  Button,
  Descriptions,
  Divider,
  Form,
  Modal,
  Space,
  Card,
  Tag,
} from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import {
  deleteNotification,
  dispatchNotification,
  updateDispatchNotification,
} from "../../../api/notifications";
import { colors } from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import EditNotification from "../EditNotification";

const ViewNotification = ({
  notification,
  isOpen,
  onClose,
  refetchNotifications,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onDispatch = useMutation(
    () => {
      return dispatchNotification(notification.id);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Dispatched"),
      onError: (error) => openErrorNotification(error),
      onSettled: () => {
        refetchNotifications();
        onClose();
      },
    }
  );

  const onUpdateDispatch = useMutation(
    () => {
      return updateDispatchNotification(notification.id);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Dispatched"),
      onError: (error) => openErrorNotification(error),
      onSettled: () => {
        refetchNotifications();
        onClose();
      },
    }
  );

  const onDelete = useMutation(
    () => {
      return deleteNotification(notification.id);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Deleted"),
      onError: (error) => openErrorNotification(error),
      onSettled: () => {
        refetchNotifications();
        onClose();
      },
    }
  );

  return (
    <>
      <EditNotification
        isOpen={isEditModalOpen}
        notification={notification}
        refetchNotifications={refetchNotifications}
        onClose={() => {
          setIsEditModalOpen(false);
          onClose();
        }}
      />

      <Modal
        footer={false}
        title={
          <>
            #{notification?.sn} {notification?.title}
          </>
        }
        visible={isOpen}
        width={1000}
        onCancel={onClose}
      >
        <div className="w-full flex gap-4 mb-8">
          <Card
            bodyStyle={{
              backgroundColor: colors.notification_sent,
              borderRadius: 8,
            }}
            bordered={false}
            className="rounded grow bg-blue-400"
          >
            <h3 className="text-2xl">{notification?.metrics?.sent_count}</h3>
            <h5>Sent Notifications</h5>
          </Card>

          <Card
            bodyStyle={{
              backgroundColor: colors.notification_clicked,
              borderRadius: 8,
            }}
            bordered={false}
            className="rounded grow"
          >
            <h3 className="text-2xl">{notification?.metrics?.clicked_count}</h3>
            <h5>Clicked Notifications</h5>
          </Card>

          <Card
            bodyStyle={{
              backgroundColor: colors.notification_seen,
              borderRadius: 8,
            }}
            bordered={false}
            className="rounded grow"
          >
            <h3 className="text-2xl">{notification?.metrics?.seen_count}</h3>
            <h5>Seen Notifications</h5>
          </Card>
        </div>

        {notification && (
          <Descriptions
            column={2}
            title={
              <div className="flex justify-between items-center">
                <h3>Notification Details</h3>

                <Space>
                  <Button
                    type="primary"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit
                  </Button>

                  <Button
                    disabled={notification.is_dispatched === true}
                    loading={onDelete.status === "loading"}
                    type="danger"
                    onClick={() => onDelete.mutate()}
                  >
                    Delete
                  </Button>
                </Space>
              </div>
            }
          >
            <Descriptions.Item label="Title" span={2}>
              {notification.title}
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={1}>
              {notification.type.replaceAll("_", " ").toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Dispatch Info" span={1}>
              {notification.is_dispatched ? (
                <Tag color="green">Dispatched</Tag>
              ) : (
                <Tag color="red">Not Dispatched</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Description" span={2}>
              {notification.content}
            </Descriptions.Item>
          </Descriptions>
        )}

        <Divider />

        {notification && (
          <Form layout="vertical">
            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button onClick={onClose}>Close</Button>
                {notification.is_dispatched ? (
                  <Button
                    htmlType="button"
                    loading={onUpdateDispatch.status === "loading"}
                    size="medium"
                    type="primary"
                    onClick={() => onUpdateDispatch.mutate()}
                  >
                    Update Dispatch
                  </Button>
                ) : (
                  <Button
                    htmlType="button"
                    loading={onDispatch.status === "loading"}
                    size="medium"
                    type="primary"
                    onClick={() => onDispatch.mutate()}
                  >
                    Dispatch
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ViewNotification;
