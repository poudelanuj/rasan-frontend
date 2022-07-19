import React from "react";
import { useMutation, useQuery } from "react-query";
import { Modal, Form, Select, Input, Space, Button, Spin } from "antd";
import { getProductSku } from "../../../../../api/products/productSku";
import {
  GET_PRODUCT_PACK,
  GET_PRODUCT_SKU,
} from "../../../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../../utils/openNotification";
import {
  getProductPack,
  updateProductPack,
} from "../../../../../api/products/productPack";

function EditProductPack({
  productSkuSlug,
  productPackId,
  isOpen,
  closeModal,
  refetchProductSku,
}) {
  const { data: productSku, status: productSkuStatus } = useQuery({
    queryFn: () => getProductSku(productSkuSlug),
    queryKey: [GET_PRODUCT_SKU, productSkuSlug],
    enabled: !!productSkuSlug,
  });

  const { data: productPack, status: productPackStatus } = useQuery({
    queryFn: () => getProductPack(productPackId),
    queryKey: [GET_PRODUCT_PACK, productPackId],
    enabled: !!productPackId,
  });

  const onFormSubmit = useMutation(
    (formValues) => updateProductPack(productPackId, formValues),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Product Pack Updated");
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
        title="Edit Product Pack"
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
                <Select.Option key={productSku.slug} value={productSku.slug}>
                  {productSku.name}
                </Select.Option>
              </Select>
            ) : (
              <Spin size="small" />
            )}
          </Form.Item>

          {productPackStatus === "loading" && (
            <div className="w-full py-4 flex justify-center">
              <Spin />
            </div>
          )}

          {productPackStatus === "success" && productPack && productPack.id && (
            <>
              <Form.Item
                initialValue={productPack?.number_of_items}
                label="Number Of Items"
                name="number_of_items"
                rules={[
                  { required: true, message: "number of items required" },
                ]}
              >
                <Input
                  defaultValue={productPack?.number_of_items}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                initialValue={productPack?.price_per_piece}
                label="Price Per Piece"
                name="price_per_piece"
                rules={[
                  { required: true, message: "price per piece required" },
                ]}
              >
                <Input
                  defaultValue={productPack?.price_per_piece}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                initialValue={productPack?.mrp_per_piece}
                label="MRP Per Piece"
                name="mrp_per_piece"
                rules={[{ required: true, message: "mrp per piece required" }]}
              >
                <Input
                  defaultValue={productPack?.mrp_per_piece}
                  type="number"
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
                      <span>Update</span>
                    )}
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default EditProductPack;
