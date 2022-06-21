import { Button, Form, Modal, Select } from "antd";

const CreateOrder = ({ isOpen, closeModal, title }) => {
  const { Option } = Select;

  return (
    <Modal footer={false} title={title} visible={isOpen} onCancel={closeModal}>
      <Form layout="vertical">
        <Form.Item
          label="Order Status"
          name="status"
          rules={[
            {
              required: true,
              message: "order status is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Order Status"
            showSearch
          >
            <Option value="in_Process">In Process</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[
            {
              required: true,
              message: "payment method is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Payment Method"
            showSearch
          >
            <Option value="cash_on_delivert">Cash On Delivery</Option>
            <Option value="esewa">Esewa</Option>
            <Option value="Khalti">Khalti</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Payment Status"
          name="paymentStatus"
          rules={[
            {
              required: true,
              message: "payment status is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Payment Status"
            showSearch
          >
            <Option value="unpaid">Unpaid</Option>
            <Option value="paid">Paid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="User"
          name="user"
          rules={[
            {
              required: true,
              message: "user is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select User"
            showSearch
          >
            <Option value="2">Darpan</Option>
            <Option value="1">Samip</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Shipping Address"
          name="shippingAddress"
          rules={[
            {
              required: true,
              message: "shipping address is required",
            },
          ]}
        >
          <Select
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="children"
            placeholder="Select Shipping Address"
            showSearch
          >
            <Option value="1">Darpan</Option>
            <Option value="13">Samip</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-blue-400"
            htmlType="submit"
            size="large"
            type="primary"
            block
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrder;
