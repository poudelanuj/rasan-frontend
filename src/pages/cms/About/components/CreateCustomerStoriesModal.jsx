import { Modal, Form, Input, Button, Upload } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";
import { postCustomerStories } from "../../../../api/aboutus";

const CreateCustomerStoriesModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  refetchCustomerStories,
}) => {
  const [form] = Form.useForm();

  const { TextArea } = Input;

  const { Dragger } = Upload;

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
        // * if form value is an array

        if (formValues[key]) formData.append(key, formValues[key]);
      });

      if (selectedImage) formData.append("image", selectedImage);

      return postCustomerStories(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        refetchCustomerStories();
        setIsCreateModalOpen(false);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      cancelText="Cancel"
      footer={
        <>
          <Button
            className="mr-2"
            type="ghost"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            loading={onFormSubmit.isLoading}
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => onFormSubmit.mutate(values));
            }}
          >
            Create Story
          </Button>
        </>
      }
      title="Create Customer Stories"
      visible={isCreateModalOpen}
      centered
      onCancel={() => setIsCreateModalOpen(false)}
    >
      <Form
        form={form}
        initialValues={{
          modifier: "public",
        }}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item label="Thumbnail">
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
            <p className="ant-upload-text">
              <span className="text-gray-500">
                click or drag file to this area to upload
              </span>
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[
            {
              required: true,
              message: "Please input fullname!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Shop Name"
          name="shop_name"
          rules={[
            {
              required: true,
              message: "Please input shop name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input content" }]}
        >
          <TextArea autoSize showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCustomerStoriesModal;
