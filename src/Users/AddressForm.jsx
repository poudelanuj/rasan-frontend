import { Button, Form, Input } from "antd";
import React from "react";

const AddressForm = ({ address }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key]);
    }
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Full Name" name="full_name">
        <Input />
      </Form.Item>
      {/* <Form.Item label="Shop Name" name="shop_name">
                  <Input />
                </Form.Item>
                {user.addresses.map((address, index) => (
                  <Form.Item
                    label={`Address-${index + 1}`}
                    name={`address-${index + 1}`}
                    key={index}
                  >
                    <Input />
                  </Form.Item>
                ))} */}
      <Form.Item label="Number" name="number">
        <Input />
      </Form.Item>
      <Form.Item label="Alternative Number" name="alternate_number">
        <Input />
      </Form.Item>
      <Form.Item label="Date of Birth" name="date_of_birth">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button className="bg-primary" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddressForm;
