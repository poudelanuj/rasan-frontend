import React from "react";
import { useMutation, useQuery } from "react-query";
import { Modal, Form, Select, Input, Space, Button, Spin } from "antd";
import { getProductSku } from "../../../../../api/productSku";
import { GET_PRODUCT_SKU } from "../../../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../../utils/openNotification";
import { createProductPack } from "../../../../../api/productPack";

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
        {productSkuStatus === "loading" && (
          <div className="my-8 flex justify-center">
            <Spin />
          </div>
        )}

        {productSkuStatus === "success" &&
          productSku &&
          productSku.price_per_piece && (
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
                <Select
                  defaultValue={productSku.slug}
                  placeholder="Select Product Sku"
                >
                  <Select.Option key={productSku.slug} value={productSku.slug}>
                    {productSku.name}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Number Of Items"
                name="number_of_items"
                rules={[
                  { required: true, message: "number of items required" },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                initialValue={productSku.price_per_piece}
                label="Price Per Piece"
                name="price_per_piece"
                rules={[
                  { required: true, message: "price per piece required" },
                ]}
              >
                <Input
                  defaultValue={productSku.price_per_piece}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                initialValue={productSku.mrp_per_piece}
                label="MRP Per Piece"
                name="mrp_per_piece"
                rules={[{ required: true, message: "mrp per piece required" }]}
              >
                <Input defaultValue={productSku.mrp_per_piece} type="number" />
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
          )}
      </Modal>
    </>
  );
}

export default AddProductPack;
