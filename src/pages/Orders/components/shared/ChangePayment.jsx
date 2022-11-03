import { Button, Form, Modal, Select, Upload } from "antd";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { updateOrderPayment } from "../../../../api/orders";
import {
  BANK_DEPOSIT,
  ORDER_TYPE_LOYALTY_REDEEM,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  REDEEM,
} from "../../../../constants";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils";

const ChangePayment = ({ payment, orderType, isOpen, onClose, width }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(""); //* Payment Method

  const { Dragger } = Upload;

  useEffect(() => {
    setSelectedImage(payment?.voucher_image);
  }, [payment]);

  const onFormSubmit = useMutation(
    (formValues) => {
      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("product_sku_image", selectedImage);

      return updateOrderPayment(payment.id, formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Order Payment Updated");
        onClose();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const fileUploadOptions = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      if (file) setSelectedImage(file);
      return false;
    },
    onRemove: () => setSelectedImage(null),
  };

  return (
    <Modal
      footer={false}
      title="Change Payment"
      visible={isOpen}
      width={width || 1000}
      onCancel={onClose}
    >
      <Form
        layout="vertical"
        onFinish={(values) => onFormSubmit.mutate(values)}
      >
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            initialValue={payment?.payment_method}
            label="Payment Method"
            name="payment_method"
            rules={[
              {
                required: true,
                message: "Payment method is required",
              },
            ]}
          >
            <Select
              className="w-full"
              defaultValue={payment?.payment_method}
              placeholder="Select Payment Method"
              onChange={(value) => setSelectedMethod(value)}
            >
              {PAYMENT_METHODS.filter((item) => {
                return orderType === ORDER_TYPE_LOYALTY_REDEEM &&
                  item === REDEEM
                  ? false
                  : true;
              }).map((item) => (
                <Select.Option key={item} value={item}>
                  {capitalize(item.replaceAll("_", " "))}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            initialValue={payment?.status}
            label="Payment Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Payment status is required",
              },
            ]}
          >
            <Select
              className="w-full"
              defaultValue={payment?.status}
              placeholder="Select Payment Status"
            >
              {PAYMENT_STATUS.map((item) => (
                <Select.Option key={item} value={item}>
                  {capitalize(item.replaceAll("_", " "))}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {selectedMethod === BANK_DEPOSIT && (
          <Form.Item label="Product Image">
            <Dragger {...fileUploadOptions}>
              <p className="ant-upload-drag-icon">
                <img
                  alt="gallery"
                  className="h-[4rem] mx-auto"
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : "/gallery-icon.svg"
                  }
                />
              </p>
              <p className="ant-upload-text ">
                <span className="text-gray-500">
                  click or drag file to this area to upload
                </span>
              </p>
            </Dragger>
          </Form.Item>
        )}

        <div className="flex items-end w-full justify-end">
          <Form.Item className="">
            <Button
              className="bg-blue-400"
              htmlType="submit"
              loading={onFormSubmit.status === "loading"}
              size="large"
              type="primary"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePayment;
