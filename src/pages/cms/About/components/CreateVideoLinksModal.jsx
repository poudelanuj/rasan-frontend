import { Modal, Form, Input, Button, Upload } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";
import { postVideoLink } from "../../../../api/aboutus";

const CreateVideoLinksModal = ({
  isCreateVideoLinkModalOpen,
  setIsCreateVideoLinkModalOpen,
  refetchVideoLinks,
}) => {
  const [form] = Form.useForm();

  const { Dragger } = Upload;

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

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

      return postVideoLink(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        refetchVideoLinks();
        setIsCreateVideoLinkModalOpen(false);
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
            onClick={() => setIsCreateVideoLinkModalOpen(false)}
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
            Create
          </Button>
        </>
      }
      title="Create Video Link"
      visible={isCreateVideoLinkModalOpen}
      centered
      onCancel={() => setIsCreateVideoLinkModalOpen(false)}
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
          label="Video URL"
          name="video_url"
          rules={[
            {
              required: true,
              message: "Please input video url!",
            },
          ]}
        >
          <Input onChange={(e) => setPreviewUrl(e.target.value)} />
        </Form.Item>
      </Form>

      {previewUrl && (
        <iframe
          className="w-full h-60"
          src={previewUrl.replace("watch?v=", "embed/")}
          title="Video Link"
        ></iframe>
      )}
    </Modal>
  );
};

export default CreateVideoLinksModal;
