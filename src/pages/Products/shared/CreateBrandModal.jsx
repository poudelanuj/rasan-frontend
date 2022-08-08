import { Button, Form, Input, Modal, Upload } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createBrand } from "../../../api/brands";
import { GET_ALL_BRANDS } from "../../../constants/queryKeys";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const CreateBrandModal = ({ isOpen, onClose }) => {
  const { Dragger } = Upload;
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);

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

  const onFormSubmit = useMutation(
    (formValues) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("brand_image", selectedImage);

      return createBrand(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "New Brand Created");
        queryClient.invalidateQueries([GET_ALL_BRANDS]);
        queryClient.refetchQueries([GET_ALL_BRANDS]);
        onClose();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      footer={false}
      title="Create New Brand"
      visible={isOpen}
      onCancel={onClose}
    >
      <Form
        layout="vertical"
        onFinish={(values) => onFormSubmit.mutate(values)}
      >
        <Form.Item>
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

        <Form.Item
          label="Brand Name"
          name="name"
          rules={[{ required: true, message: "brand name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Brand Name (Nepali)" name="name_np">
          <Input />
        </Form.Item>

        <div className="w-full flex justify-end">
          <Button htmlType="submit" type="primary">
            Create Brand
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateBrandModal;
