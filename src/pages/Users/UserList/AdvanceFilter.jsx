import { Modal, Button, Form, Input, Select } from "antd";

export default function AdvanceFilter({ isOpen, closeModal, refetch, form }) {
  return (
    <Modal
      footer={
        <>
          <Button
            onClick={() => {
              form.resetFields();
              refetch();
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              refetch();
              closeModal();
            }}
          >
            Apply Filter
          </Button>
        </>
      }
      title="User Filter"
      visible={isOpen}
      onCancel={closeModal}
    >
      <Form form={form}>
        <Form.Item label="Order Date: " name="order_date">
          <Select placeholder="Select date">
            <Select.Option key="last_week" value="last_week">
              Last Week
            </Select.Option>
            <Select.Option key="last_month" value="last_month">
              Last Month
            </Select.Option>
            <Select.Option key="last_3_month" value="last_3_month">
              Last 3 Month
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Max order amount: " name="max_order_amount">
          <Input placeholder="Enter max order amount" type="number" />
        </Form.Item>

        <Form.Item label="Min order amount: " name="min_order_amount">
          <Input placeholder="Enter min order amount" type="number" />
        </Form.Item>

        <Form.Item label="Number of orders: " name="order_number">
          <Input placeholder="Enter number of orders" type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
