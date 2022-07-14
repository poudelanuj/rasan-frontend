import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useMutation } from "react-query";
import { createNotification } from "../../../api/notifications";
import { NOTIFICATION_STATUS, NOTIFICATION_TYPES } from "../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const CreateNotification = ({ isOpen, onClose }) => {
  const onFormSubmit = useMutation(
    (formValues) => {
      return createNotification(formValues);
    },
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Notification Created"),
      onError: (error) => openErrorNotification(error),
    }
  );

  return (
    <Modal
      footer={false}
      title={<>Create Notification</>}
      visible={isOpen}
      width={1000}
      onCancel={onClose}
    >
      <Form
        layout="vertical"
        onFinish={(values) => onFormSubmit.mutate(values)}
      >
        <Form.Item label="Notification Title" name="title">
          <Input />
        </Form.Item>

        <Form.Item label="Notification Description" name="content">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="grid gap-2 grid-cols-2">
          <Form.Item label="Notification Type" name="type">
            <Select placeholder="Select Type" allowClear>
              {NOTIFICATION_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Notification Status" name="status">
            <Select placeholder="Select Status" allowClear>
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
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNotification;
