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
import { dispatchNotification } from "../../../api/notifications";
import { colors } from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import EditNotification from "../EditNotification";

const ViewNotification = ({ notification, isOpen, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onDispatch = useMutation(
    () => {
      return dispatchNotification(notification.id);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Dispatched"),
      onError: (error) => openErrorNotification(error),
    }
  );

  return (
    <>
      <EditNotification
        isOpen={isEditModalOpen}
        notification={notification}
        onClose={() => setIsEditModalOpen(false)}
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

                <Button type="primary" onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </Button>
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
          <Form layout="vertical" onFinish={() => onDispatch.mutate()}>
            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button onClick={onClose}>Close</Button>
                <Button htmlType="submit" size="medium" type="primary">
                  Dispatch
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ViewNotification;
