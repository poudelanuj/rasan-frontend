import moment from "moment";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Tag, Button, Image, Form, Select, Upload, Space } from "antd";
import { useState } from "react";
import { capitalize } from "lodash";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  deleteBanners,
  getPromotionsById,
  postBanners,
  publishBanners,
} from "../../../api/promotions";
import {
  GET_PROMOTIONS_BY_ID,
  GET_USER_GROUPS_BY_ID,
} from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import { getStatusColor } from "..";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import UpdateBannersModal from "./UpdateBannersModal";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { getUserGroupsById } from "../../../api/userGroups";

const ViewPromotionsPage = () => {
  const { promotionsId } = useParams();

  const [form] = Form.useForm();

  const { Dragger } = Upload;

  const { Option } = Select;

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  const [isUpdateBanner, setIsUpdateBanner] = useState({
    isOpen: false,
    id: "",
  });

  const [isDeleteBanner, setIsDeleteBanner] = useState({
    isOpen: false,
    id: "",
  });

  const {
    data: promotions,
    status: promotionStatus,
    refetch: refetchPromotions,
  } = useQuery({
    queryFn: () => getPromotionsById(promotionsId),
    queryKey: [GET_PROMOTIONS_BY_ID, promotionsId],
    enabled: !!promotionsId,
  });

  const { data: userGroups } = useQuery({
    queryFn: () => getUserGroupsById(promotions && promotions.user_groups),
    queryKey: [GET_USER_GROUPS_BY_ID, promotionsId],
    enabled: !!promotionsId && !!promotions,
  });

  const handlePublishBanner = useMutation(
    ({ id, shouldPublish }) => publishBanners({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchPromotions();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleDeleteBanner = useMutation((id) => deleteBanners(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Banners deleted successfully");
      refetchPromotions();
      setIsDeleteBanner({ ...isDeleteBanner, isOpen: false });
    },
    onError: (err) => openErrorNotification(err),
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

  const handlePostBanners = useMutation(
    (formValues) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array

        if (formValues[key]) formData.append(key, formValues[key]);
      });

      if (selectedImage) formData.append("image", selectedImage);

      return postBanners(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchPromotions();
        form.resetFields();
        setSelectedImage(null);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  return (
    <>
      {promotionStatus === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        <>
          {promotions && (
            <>
              <CustomPageHeader title={promotions.title} />

              <div className="py-5 px-4 bg-[#FFFFFF]">
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Promotion Details</p>
                    <p>
                      Created at:{" "}
                      <span className="font-semibold">
                        {moment(promotions.created_at).format("ll")}
                      </span>
                    </p>
                    <p>
                      Last Edited at:{" "}
                      <span className="font-semibold">
                        {moment(promotions.last_edited_at).format("ll")}
                      </span>
                    </p>
                    <p>
                      Published at:{" "}
                      <span className="font-semibold">
                        {promotions.published_at
                          ? moment(promotions.published_at).format("ll")
                          : "Not Published"}
                      </span>
                    </p>
                    <Tag
                      className="text-center w-fit"
                      color={
                        promotions.is_published
                          ? getStatusColor(PUBLISHED)
                          : getStatusColor(UNPUBLISHED)
                      }
                    >
                      {promotions.is_published ? "Published" : "Not published"}
                    </Tag>
                  </div>

                  <div
                    className="text-[#00A0B0] cursor-pointer flex items-center gap-1.5"
                    onClick={() => navigate(`../update/${promotionsId}`)}
                  >
                    <EditOutlined /> Edit Details
                  </div>
                </div>

                <div className="grid grid-cols-2 pt-8 text-md">
                  <p>
                    Title:{" "}
                    <span className="font-semibold">{promotions.title}</span>
                  </p>
                  <p>
                    Type:{" "}
                    <span className="font-semibold">
                      {capitalize(promotions.type).replaceAll("_", " ")}
                    </span>
                  </p>
                  <p>
                    Details:{" "}
                    <span className="font-semibold">{promotions.detail}</span>
                  </p>
                  <p>
                    Context:{" "}
                    <span className="font-semibold">
                      {capitalize(
                        promotions.brand ||
                          promotions.category ||
                          promotions.product_group
                      ).replaceAll("-", " ")}
                    </span>
                  </p>
                  <p>
                    User group:{" "}
                    {userGroups &&
                      userGroups.map((el) => (
                        <span
                          key={el.data.data.id}
                          className="font-semibold pr-1"
                        >
                          {el.data.data.name},
                        </span>
                      ))}
                  </p>
                  <p>
                    No. of banners:{" "}
                    <span className="font-semibold pr-1">
                      {promotions.banners.length}
                    </span>
                  </p>
                </div>
              </div>

              <div className="my-5 py-5 px-4 bg-[#FFFFFF] flex flex-col">
                <p className="text-lg font-semibold">Banners</p>

                <Form
                  autoComplete="off"
                  className="w-1/2 mb-10"
                  form={form}
                  initialValues={{ remember: true }}
                  layout="vertical"
                  name="basic"
                  onFinish={() =>
                    form.validateFields().then((values) =>
                      handlePostBanners.mutate({
                        ...values,
                        promotion: promotionsId,
                      })
                    )
                  }
                >
                  <Form.Item required={true}>
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
                      <Option value="web_home_top">Web Home Top</Option>
                      <Option value="web_home_bottom">Web Home Bottom</Option>
                    </Select>
                  </Form.Item>

                  <p>
                    The recommended size for app banners is of aspect ratio
                    828x360 and for website banners is of aspect ratio 1320x400.
                  </p>

                  <Form.Item>
                    <Space>
                      <Button
                        htmlType="submit"
                        loading={handlePostBanners.isLoading}
                        type="primary"
                      >
                        Save
                      </Button>
                      <Button type="ghost" onClick={() => form.resetFields()}>
                        Reset
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>

                {promotions.banners &&
                  promotions.banners.map((el) => (
                    <div key={el.id} className="mb-10 flex gap-9">
                      <Image
                        className="object-cover"
                        height={300}
                        src={el.image.full_size}
                        width={500}
                      />

                      <div className="flex flex-col gap-1.5">
                        <Tag
                          className="text-center w-fit"
                          color={
                            el.is_published
                              ? getStatusColor(PUBLISHED)
                              : getStatusColor(UNPUBLISHED)
                          }
                        >
                          {el.is_published ? "Published" : "Not published"}
                        </Tag>
                        <p>
                          Banner ID:{" "}
                          <span className="font-semibold">{el.id}</span>
                        </p>
                        <p>
                          Created at:{" "}
                          <span className="font-semibold">
                            {moment(el.created_at).format("ll")}
                          </span>
                        </p>
                        <p>
                          Last Edited at:{" "}
                          <span className="font-semibold">
                            {moment(el.last_edited_at).format("ll")}
                          </span>
                        </p>
                        <p>
                          Published at:{" "}
                          <span className="font-semibold">
                            {el.published_at
                              ? moment(el.published_at).format("ll")
                              : "Not Published"}
                          </span>
                        </p>
                        <p>
                          Location:{" "}
                          <span className="font-semibold">
                            {capitalize(el.location).replaceAll("_", " ")}
                          </span>
                        </p>

                        <div className="flex items-center gap-5">
                          <Button
                            danger={el.is_published}
                            loading={
                              handlePublishBanner.variables &&
                              handlePublishBanner.variables.id === el.id &&
                              handlePublishBanner.isLoading
                            }
                            type="primary"
                            onClick={() =>
                              handlePublishBanner.mutate({
                                id: el.id,
                                shouldPublish: !el.is_published,
                              })
                            }
                          >
                            {el.is_published ? "Unpublish" : "Publish"}
                          </Button>

                          <EditOutlined
                            className="text-xl"
                            onClick={() =>
                              setIsUpdateBanner({
                                ...isUpdateBanner,
                                isOpen: true,
                                id: el.id,
                              })
                            }
                          />

                          <DeleteOutlined
                            className="text-xl cursor-pointer"
                            onClick={() =>
                              setIsDeleteBanner({
                                ...isDeleteBanner,
                                isOpen: true,
                                id: el.id,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <UpdateBannersModal
                bannerId={isUpdateBanner.id}
                isUpdateBannerModalOpen={isUpdateBanner.isOpen}
                promotionsId={promotionsId}
                refetchPromotions={refetchPromotions}
                setIsUpdateBannerModalOpen={() =>
                  setIsUpdateBanner({ ...isUpdateBanner, isOpen: false })
                }
              />

              <ConfirmDelete
                closeModal={() =>
                  setIsDeleteBanner({ ...isDeleteBanner, isOpen: false })
                }
                deleteMutation={() =>
                  handleDeleteBanner.mutate(isDeleteBanner.id)
                }
                isOpen={isDeleteBanner.isOpen}
                status={handleDeleteBanner.status}
                title="Delete Banner?"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewPromotionsPage;
