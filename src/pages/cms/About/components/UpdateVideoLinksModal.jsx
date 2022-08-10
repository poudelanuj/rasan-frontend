import { Modal, Form, Input, Button, Upload } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";
import {
  deleteVideoLink,
  getVideoLinkById,
  publishVideo,
  updateVideo,
} from "../../../../api/aboutus";
import { GET_VIDEO_LINK_BY_ID } from "../../../../constants/queryKeys";
import Loader from "../../../../shared/Loader";
import ConfirmDelete from "../../../../shared/ConfirmDelete";

const UpdateVideoLinksModal = ({
  isUpdateVideoLinkModalOpen,
  setIsUpdateVideoLinkModalOpen,
  videoId,
  refetchVideoLinks,
}) => {
  const [form] = Form.useForm();

  const { Dragger } = Upload;

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [isDeleteVideoLinkModalOpen, setIsDeleteVideoLinkModalOpen] =
    useState(false);

  const {
    data: videoLink,
    refetch: refetchUpdatedVideoLink,
    isFetching,
    isSuccess,
  } = useQuery({
    queryFn: () => getVideoLinkById(videoId),
    queryKey: [GET_VIDEO_LINK_BY_ID, videoId],
    enabled: !!videoId,
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

      return updateVideo({ id: videoLink && videoLink.id, data: formData });
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        refetchVideoLinks();
        refetchUpdatedVideoLink();
        setIsUpdateVideoLinkModalOpen(false);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleDeleteVideoLink = useMutation((id) => deleteVideoLink(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      refetchVideoLinks();
      setIsDeleteVideoLinkModalOpen(false);
      setIsUpdateVideoLinkModalOpen(false);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handlePublishVideoLink = useMutation(
    ({ id, shouldPublish }) => publishVideo({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchVideoLinks();
        refetchUpdatedVideoLink();
        setIsUpdateVideoLinkModalOpen(false);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    if (isSuccess)
      form.setFieldsValue({
        video_url: videoLink.video_url,
      });
    setSelectedImage(null);
  }, [isSuccess, videoLink, form, videoId]);

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
                onClick={() => {
                  setSelectedImage(null);
                  setIsUpdateVideoLinkModalOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteVideoLinkModalOpen(true)}
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
              <span>Update Video Link</span>
              <Button
                danger={videoLink && videoLink.is_published}
                loading={handlePublishVideoLink.isLoading}
                type="primary"
                onClick={() =>
                  handlePublishVideoLink.mutate({
                    id: videoLink && videoLink.id,
                    shouldPublish: videoLink && !videoLink.is_published,
                  })
                }
              >
                {videoLink?.is_published ? "Unpublish" : "Publish"}
              </Button>
            </span>,
          ]}
          visible={isUpdateVideoLinkModalOpen}
          centered
          onCancel={() => {
            setSelectedImage(null);
            setIsUpdateVideoLinkModalOpen(false);
          }}
        >
          {videoLink && (
            <>
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
                    {selectedImage || !videoLink.image.full_size ? (
                      <>
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
                      </>
                    ) : (
                      <img
                        alt=""
                        className="object-cover"
                        src={videoLink.image.full_size}
                      />
                    )}
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
                    () => ({
                      validator(_, value) {
                        if (value.includes("youtube.com")) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error("Only Youtube video links allowed!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input onChange={(e) => setPreviewUrl(e.target.value)} />
                </Form.Item>
              </Form>

              {(previewUrl || videoLink.video_url) && (
                <iframe
                  className="w-full h-60"
                  src={
                    previewUrl.replace("watch?v=", "embed/") ||
                    videoLink.video_url.replace("watch?v=", "embed/")
                  }
                  title="Video Link"
                ></iframe>
              )}
            </>
          )}

          <ConfirmDelete
            closeModal={() => setIsDeleteVideoLinkModalOpen(false)}
            deleteMutation={() =>
              handleDeleteVideoLink.mutate(videoLink && videoLink.id)
            }
            isOpen={isDeleteVideoLinkModalOpen}
            status={handleDeleteVideoLink.status}
            title={"Delete Video Link"}
          />
        </Modal>
      )}
    </>
  );
};

export default UpdateVideoLinksModal;
