import {
  Button,
  Descriptions,
  Divider,
  Form,
  Modal,
  Select,
  Space,
  Tag,
} from "antd";
import { useMutation } from "react-query";
import { updateNotification } from "../../../api/notifications";
import { NOTIFICATION_STATUS } from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const ViewNotification = ({ notification, isOpen, onClose }) => {
  const onStatusUpdate = useMutation(
    (formValues) => {
      return updateNotification(notification?.id, {
        status: formValues["status"],
      });
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Updated"),
      onError: (error) => openErrorNotification(error),
    }
  );

  return (
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
      {notification && (
        <Descriptions column={2} title="Notification Details">
          <Descriptions.Item label="Title" span={2}>
            {notification.title}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {notification.type.replaceAll("_", " ").toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {notification.status.replaceAll("_", " ").toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="User">
            {notification.user?.user}
          </Descriptions.Item>
          <Descriptions.Item label="Seen">
            {notification.seen ? (
              <Tag color="green">YES</Tag>
            ) : (
              <Tag color="orange">NO</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {notification.content}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Divider />

      {notification && (
        <Form
          layout="vertical"
          onFinish={(values) => onStatusUpdate.mutate(values)}
        >
          <div className="flex items-end gap-3">
            <Form.Item
              initialValue={notification.status}
              label="Notification Status"
              name="status"
            >
              <Select
                defaultValue={notification.status}
                placeholder="Select Status"
                style={{ width: 200 }}
                allowClear
              >
                {NOTIFICATION_STATUS.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button htmlType="submit" size="medium" type="primary">
                  Update
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ViewNotification;
