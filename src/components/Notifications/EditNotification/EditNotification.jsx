import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { updateNotification } from "../../../api/notifications";
import {
  NOTIFICATION_DESTINATION_TYPES,
  NOTIFICATION_TYPES,
} from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const EditNotification = ({ notification, isOpen, onClose }) => {
  const [selectedNotificationType, setSelectedNotificationType] = useState();

  useEffect(() => {
    setSelectedNotificationType(notification.type);
  }, [notification]);

  const onFormSubmit = useMutation(
    (formValues) => {
      return updateNotification(notification?.id, formValues);
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
          Edit Notification - #{notification?.sn} {notification?.title}
        </>
      }
      visible={isOpen}
      width={1000}
      onCancel={onClose}
    >
      {notification && (
        <Form
          layout="vertical"
          onFinish={(values) => onFormSubmit.mutate(values)}
        >
          <Form.Item
            initialValue={notification.title}
            label="Notification Title"
            name="title"
          >
            <Input defaultValue={notification.title} />
          </Form.Item>

          <Form.Item
            initialValue={notification.content}
            label="Notification Description"
            name="content"
          >
            <Input.TextArea defaultValue={notification.content} rows={3} />
          </Form.Item>

          <div
            className={`grid gap-2 grid-cols-${
              NOTIFICATION_DESTINATION_TYPES.includes(selectedNotificationType)
                ? "2"
                : "1"
            }`}
          >
            <Form.Item
              initialValue={notification.type}
              label="Notification Type"
              name="type"
            >
              <Select
                defaultValue={notification.type}
                placeholder="Select Type"
                allowClear
                onChange={(value) => setSelectedNotificationType(value)}
              >
                {NOTIFICATION_TYPES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {NOTIFICATION_DESTINATION_TYPES.includes(
              selectedNotificationType
            ) && (
              <Form.Item
                initialValue={notification.destination_id}
                label="Destination"
                name="destination_id"
              >
                <Input defaultValue={notification.destination_id} />
              </Form.Item>
            )}
          </div>

          <Form.Item>
            <Space className="w-full flex justify-end">
              <Button onClick={onClose}>Cancel</Button>
              <Button htmlType="submit" size="medium" type="primary">
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditNotification;
