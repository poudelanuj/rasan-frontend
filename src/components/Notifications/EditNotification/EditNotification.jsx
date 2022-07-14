import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useMutation } from "react-query";
import { updateNotification } from "../../../api/notifications";
import { NOTIFICATION_STATUS, NOTIFICATION_TYPES } from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const EditNotification = ({ notification, isOpen, onClose }) => {
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

          <div className="grid gap-2 grid-cols-2">
            <Form.Item
              initialValue={notification.type}
              label="Notification Type"
              name="type"
            >
              <Select
                defaultValue={notification.type}
                placeholder="Select Type"
                allowClear
              >
                {NOTIFICATION_TYPES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={notification.status}
              label="Notification Status"
              name="status"
            >
              <Select
                defaultValue={notification.status}
                placeholder="Select Status"
                allowClear
              >
                {NOTIFICATION_STATUS.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
