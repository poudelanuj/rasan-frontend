import {
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Upload, Form, Input, Select, Switch, Button, Space } from "antd";
import AddProductList from "../AddProductList";

const AddProduct = () => {
  const { Dragger } = Upload;

  const fileUploadOptions = {};

  return (
    <div className="py-5">
      <h2 className="text-2xl  font-normal mb-5">Add Product</h2>

      <div>
        <Form layout="vertical">
          <Form.Item
            label="Image Upload"
            name="image"
            rules={[{ required: true, message: "image required" }]}
          >
            <Dragger {...fileUploadOptions}>
              <p className="ant-upload-text text-[13px]">
                <UploadOutlined />
                <span> Click or drag file to this area to upload</span>
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "product name required" }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Product Category"
              name="category"
              rules={[{ required: true, message: "category required" }]}
            >
              <Select mode="multiple" placeholder="Select Category" allowClear>
                <Select.Option key="1" value="rice">
                  Rice
                </Select.Option>
                <Select.Option key="2" value="lentils">
                  Lentils
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Product Brand"
              name="brand"
              rules={[{ required: true, message: "brand required" }]}
            >
              <Select mode="multiple" placeholder="Select Brand" allowClear>
                <Select.Option key="1" value="rice">
                  Rice
                </Select.Option>
                <Select.Option key="2" value="lentils">
                  Lentils
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Alternate Products">
              <Select mode="multiple" placeholder="Select Products" allowClear>
                <Select.Option key="1" value="rice">
                  Rice
                </Select.Option>
                <Select.Option key="2" value="lentils">
                  Lentils
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Supplement Products">
              <Select mode="multiple" placeholder="Select Products" allowClear>
                <Select.Option key="1" value="rice">
                  Rice
                </Select.Option>
                <Select.Option key="2" value="lentils">
                  Lentils
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Loyalty Policy">
              <Select
                mode="multiple"
                placeholder="Select Loyalty Policy"
                allowClear
              >
                <Select.Option key="1" value="rice">
                  Rice
                </Select.Option>
                <Select.Option key="2" value="lentils">
                  Lentils
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Is Vat Included?">
              <Switch
                checkedChildren={<CheckOutlined />}
                className="flex"
                defaultChecked={false}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Space className="w-full flex justify-end">
              <Button size="large" type="primary">
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
