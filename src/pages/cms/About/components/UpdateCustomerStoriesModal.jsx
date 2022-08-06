import { Modal, Form, Input, Button, Upload } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";
import {
  deleteCustomerStories,
  getCustomerStoriesById,
  publishCustomerStories,
  updateCustomerStories,
} from "../../../../api/aboutus";
import { GET_CUSTOMER_STORY_BY_ID } from "../../../../constants/queryKeys";
import Loader from "../../../../shared/Loader";
import ConfirmDelete from "../../../../shared/ConfirmDelete";

const UpdateCustomerStoriesModal = ({
  isUpdateCustomerStoriesModalOpen,
  setIsUpdateCustomerStoriesModalOpen,
  customerId,
  refetchCustomerStories,
}) => {
  const [form] = Form.useForm();

  const { Dragger } = Upload;

  const { TextArea } = Input;

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    isDeleteCustomerStoriesModalOpen,
    setIsDeleteCustomerStoriesModalOpen,
  ] = useState(false);

  const {
    data: customerStories,
    refetch: refetchUpdatedCustomerStories,
    isFetching,
    isSuccess,
  } = useQuery({
    queryFn: () => getCustomerStoriesById(customerId),
    queryKey: [GET_CUSTOMER_STORY_BY_ID, customerId],
    enabled: !!customerId,
  });

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

      return updateCustomerStories({
        id: customerStories && customerStories.id,
        data: formData,
      });
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        refetchCustomerStories();
        refetchUpdatedCustomerStories();
        setIsUpdateCustomerStoriesModalOpen(false);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleDeleteCustomerStories = useMutation(
    (id) => deleteCustomerStories(id),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchCustomerStories();
        setIsDeleteCustomerStoriesModalOpen(false);
        setIsUpdateCustomerStoriesModalOpen(false);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handlePublishCustomerStories = useMutation(
    ({ id, shouldPublish }) => publishCustomerStories({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchCustomerStories();
        refetchUpdatedCustomerStories();
        setIsUpdateCustomerStoriesModalOpen(false);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    if (isSuccess)
      form.setFieldsValue({
        full_name: customerStories.full_name,
        shop_name: customerStories.shop_name,
        content: customerStories.content,
      });
  }, [isSuccess, customerStories, form]);

  return (
    <>
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <Modal
          cancelText="Cancel"
          closable={false}
          footer={
            <>
              <Button
                type="ghost"
                onClick={() => setIsUpdateCustomerStoriesModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteCustomerStoriesModalOpen(true)}
              >
                Delete
              </Button>
              <Button
                loading={onFormSubmit.isLoading}
                type="primary"
                onClick={() =>
                  form
                    .validateFields()
                    .then((values) => onFormSubmit.mutate(values))
                }
              >
                Update
              </Button>
            </>
          }
          title={[
            <span
              key="title"
              className="w-full flex items-center justify-between"
            >
              <span>Update Customer Stories</span>
              <Button
                danger={customerStories && customerStories.is_published}
                loading={handlePublishCustomerStories.isLoading}
                type="primary"
                onClick={() =>
                  handlePublishCustomerStories.mutate({
                    id: customerStories && customerStories.id,
                    shouldPublish:
                      customerStories && !customerStories.is_published,
                  })
                }
              >
                {customerStories?.is_published ? "Unpublish" : "Publish"}
              </Button>
            </span>,
          ]}
          visible={isUpdateCustomerStoriesModalOpen}
          centered
          onCancel={() => setIsUpdateCustomerStoriesModalOpen(false)}
        >
          {customerStories && (
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
          )}

          <ConfirmDelete
            closeModal={() => setIsDeleteCustomerStoriesModalOpen(false)}
            deleteMutation={() =>
              handleDeleteCustomerStories.mutate(
                customerStories && customerStories.id
              )
            }
            isOpen={isDeleteCustomerStoriesModalOpen}
            status={handleDeleteCustomerStories.status}
            title={"Delete Customer Story"}
          />
        </Modal>
      )}
    </>
  );
};

export default UpdateCustomerStoriesModal;
