import { useEffect } from "react";
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
  const [form] = Form.useForm();

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

  useEffect(() => {
    if (productPack && productSku)
      form.setFieldsValue({
        product_sku: productSku.slug,
        number_of_items: productPack.number_of_items,
        price_per_piece: productPack.price_per_piece,
        mrp_per_piece: productPack.mrp_per_piece,
      });
  }, [form, productPack, productSku]);

  return (
    <>
      <Modal
        footer={false}
        title="Edit Product Pack"
        visible={isOpen}
        onCancel={() => closeModal()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFormSubmit.mutate(values)}
        >
          <Form.Item
            label="Product Sku"
            name="product_sku"
            rules={[{ required: true, message: "Product Sku is required" }]}
          >
            {productSkuStatus === "success" && productSku ? (
              <Select
                loading={productSkuStatus === "loading"}
                placeholder="Select Product Sku"
                disabled
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
                  { required: true, message: "Number of items required" },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Price Per Piece"
                name="price_per_piece"
                rules={[
                  { required: true, message: "Price per piece is required" },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="MRP Per Piece"
                name="mrp_per_piece"
                rules={[
                  { required: true, message: "MRP per piece is required" },
                ]}
              >
                <Input type="number" />
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
