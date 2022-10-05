import { Modal, Form, Button, Input, Select, Image } from "antd";
import { capitalize } from "lodash";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { updateRedeemableProduct } from "../../../api/loyaltyRedeem";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const UpdateLoyaltyRedeemModal = ({
  image,
  productSku,
  quota,
  redeemType,
  loyaltyPoints,
  id,
  isOpen,
  closeModal,
  refetch,
}) => {
  const [form] = Form.useForm();

  const { Option } = Select;

  const handleUpdateLoyalty = useMutation(
    ({ id, data }) => updateRedeemableProduct({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetch();
        closeModal();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    form.setFieldsValue({
      product_sku: productSku,
      redeem_type: redeemType,
      loyalty_points: loyaltyPoints,
      quota: quota,
    });
  }, [productSku, redeemType, loyaltyPoints, quota, form]);

  return (
    <Modal
      cancelText="Cancel"
      footer={
        <>
          <Button type="ghost" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            loading={handleUpdateLoyalty.isLoading}
            type="primary"
            onClick={() => {
              form.validateFields().then((values) =>
                handleUpdateLoyalty.mutate({
                  id,
                  data: values,
                })
              );
            }}
          >
            Update
          </Button>
        </>
      }
      title="Update Banner"
      visible={isOpen}
      centered
      onCancel={closeModal}
    >
      <Form
        autoComplete="off"
        className="grid grid-cols-2 gap-x-4"
        form={form}
        initialValues={{ remember: true }}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item className="col-span-full text-center">
          <Image height={150} src={image} />
        </Form.Item>
        <Form.Item
          className="col-span-full"
          label="Product Sku"
          name="product_sku"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select an option" allowClear disabled>
            <Option value={productSku}>
              {capitalize(productSku).replaceAll("-", " ")}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          className="col-span-full"
          label="Redeem Type"
          name="redeem_type"
          rules={[
            {
              required: true,
              message: "Please select redeem type",
            },
          ]}
        >
          <Select placeholder="Select an option" allowClear>
            <Option value="rasan_deal">Rasan Deal</Option>
            <Option value="special_deal">Special Deal</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Loyalty Points"
          name="loyalty_points"
          rules={[
            {
              required: true,
              message: "Please input loyalty points",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quota"
          name="quota"
          rules={[
            {
              required: true,
              message: "Please input quota",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateLoyaltyRedeemModal;
