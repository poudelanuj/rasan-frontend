import { useState } from "react";
import { Modal, Form, Upload, Select, Button } from "antd";
import { useMutation, useQuery } from "react-query";
import { updateBanners, getBannersById } from "../../../api/promotions";
import { openSuccessNotification, openErrorNotification } from "../../../utils";
import { GET_PROMOTIONS_BANNERS_BY_ID } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import { useEffect } from "react";

const UpdateBannersModal = ({
  isUpdateBannerModalOpen,
  setIsUpdateBannerModalOpen,
  refetchPromotions,
  bannerId,
  promotionsId,
}) => {
  const { Dragger } = Upload;

  const [form] = Form.useForm();

  const { Option } = Select;

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    data: banner,
    status,
    refetch: refetchBanner,
  } = useQuery({
    queryFn: () => getBannersById(bannerId),
    queryKey: [GET_PROMOTIONS_BANNERS_BY_ID, bannerId],
    enabled: !!bannerId && !!promotionsId,
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

  const handleUpdateBanners = useMutation(
    ({ id, formValues }) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array

        if (formValues[key]) formData.append(key, formValues[key]);
      });

      if (selectedImage) formData.append("image", selectedImage);

      return updateBanners({ id, data: formData });
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchBanner();
        refetchPromotions();
        setIsUpdateBannerModalOpen(false);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  useEffect(() => {
    if (status === "success")
      form.setFieldsValue({ location: banner.location });
  }, [status, banner, form]);

  return (
    <>
      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        banner && (
          <Modal
            cancelText="Cancel"
            footer={
              <>
                <Button
                  type="ghost"
                  onClick={() => {
                    setSelectedImage(null);
                    setIsUpdateBannerModalOpen(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  loading={handleUpdateBanners.isLoading}
                  type="primary"
                  onClick={() => {
                    form.validateFields().then((values) =>
                      handleUpdateBanners.mutate({
                        id: bannerId,
                        formValues: {
                          ...values,
                          promotion: promotionsId,
                        },
                      })
                    );
                  }}
                >
                  Update
                </Button>
              </>
            }
            title="Update Banner"
            visible={isUpdateBannerModalOpen}
            centered
            onCancel={() => {
              setSelectedImage(null);
              setIsUpdateBannerModalOpen(false);
            }}
          >
            <Form
              autoComplete="off"
              form={form}
              initialValues={{ remember: true }}
              layout="vertical"
              name="form_in_modal"
            >
              <Form.Item required={true}>
                <Dragger {...fileUploadOptions}>
                  {selectedImage || !banner.image.full_size ? (
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
                      src={banner.image.full_size}
                    />
                  )}
                </Dragger>
              </Form.Item>

              <Form.Item
                label="Market Location"
                name="location"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select an option" allowClear>
                  <Option value="app_home_top">App Home Top</Option>
                  <Option value="app_home_bottom">App Home Bottom</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        )
      )}
    </>
  );
};

export default UpdateBannersModal;
