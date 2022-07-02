import React from "react";
import { useMutation, useQuery } from "react-query";
import { Modal, Form, Select, Input, Space, Button, Spin, Switch } from "antd";
import { getProductSku } from "../../../../api/productSku";
import { GET_PRODUCT_SKU } from "../../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { createProductPack } from "../../../../api/productPack";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function AddProductPack({
  productSkuSlug,
  isOpen,
  closeModal,
  refetchProductSku,
}) {
  const { data: productSku, status: productSkuStatus } = useQuery({
    queryFn: () => getProductSku(productSkuSlug),
    queryKey: [GET_PRODUCT_SKU, productSkuSlug],
    enabled: !!productSkuSlug,
  });

  const onFormSubmit = useMutation(
    (formValues) => createProductPack(formValues),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Product Pack Added");
        refetchProductSku();
      },
      onError: (err) => {
        openErrorNotification(err);
      },
      onSettled: () => {
        closeModal();
      },
    }
  );

  return (
    <>
      <Modal
        footer={false}
        title="Add Product Pack"
        visible={isOpen}
        onCancel={() => closeModal()}
      >
        <Form
          layout="vertical"
          onFinish={(values) => onFormSubmit.mutate(values)}
        >
          <Form.Item
            initialValue={productSku.slug}
            label="Product Sku"
            name="product_sku"
            rules={[{ required: true, message: "product sku required" }]}
          >
            {productSkuStatus === "success" && productSku ? (
              <Select
                defaultValue={productSku.slug}
                loading={productSkuStatus === "loading"}
                placeholder="Select Product Sku"
              >
                <Select.Option key={productSku.sn} value={productSku.slug}>
                  {productSku.name}
                </Select.Option>
              </Select>
            ) : (
              <Spin size="small" />
            )}
          </Form.Item>

          <Form.Item
            label="Number Of Items"
            name="number_of_items"
            rules={[{ required: true, message: "number of items required" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Price Per Piece"
            name="price_per_piece"
            rules={[{ required: true, message: "price per piece required" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="MRP Per Piece"
            name="mrp_per_piece"
            rules={[{ required: true, message: "mrp per piece required" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Is Published?" name="is_published">
            <Switch
              checkedChildren={<CheckOutlined />}
              className="flex"
              defaultChecked={false}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Space className="w-full flex justify-end">
              <Button
                disabled={onFormSubmit.status === "loading"}
                htmlType="submit"
                size="large"
                type="primary"
              >
                {onFormSubmit.status === "loading" ? (
                  <Spin />
                ) : (
                  <span>Create</span>
                )}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddProductPack;
