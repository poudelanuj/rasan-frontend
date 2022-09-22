import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Tag, Form, Select, Upload, Input, Card, Image } from "antd";
import { EyeOutlined, LikeOutlined } from "@ant-design/icons";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getTagListById,
  getTutorialsById,
  getTutorialTags,
  updateTutorial,
} from "../../../../api/tutorial";
import {
  GET_TAGLISTS,
  GET_TAGLISTS_BY_ID,
  GET_TUTORIALS_BY_ID,
} from "../../../../constants/queryKeys";
import CustomPageHeader from "../../../../shared/PageHeader";
import { PUBLISHED, UNPUBLISHED } from "../../../../constants";
import { GET_TUTORIALS } from "../../../../constants/queryKeys";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils";
import Loader from "../../../../shared/Loader";
import { publishTutorial } from "../../../../api/tutorial";
import ButtonWPermission from "../../../../shared/ButtonWPermission";

export const getStatusColor = (status) => {
  switch (status) {
    case PUBLISHED:
      return "green";
    case UNPUBLISHED:
      return "orange";
    default:
      return "green";
  }
};

const UpdateTutorial = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { slug } = useParams();

  const [form] = Form.useForm();

  const { Dragger } = Upload;

  const { Option } = Select;

  const { Meta } = Card;

  const { TextArea } = Input;

  const [iframeLink, setIframeLink] = useState("");

  const [getMarkdown, setGetMarkdown] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    data: dataSource,
    status,
    refetch: refetchTutorials,
  } = useQuery({
    queryFn: () => getTutorialsById(slug),
    queryKey: [GET_TUTORIALS_BY_ID, slug],
    enabled: !!slug,
  });

  const { data: tagList } = useQuery({
    queryFn: () => getTutorialTags(),
    queryKey: GET_TAGLISTS,
  });

  const { data: dataSourceTagList } = useQuery({
    queryFn: () => getTagListById(dataSource?.tags),
    queryKey: [GET_TAGLISTS_BY_ID, dataSource?.tags],
    enabled: !!dataSource?.tags && !!slug,
  });

  const handlePublishTutorial = useMutation(
    ({ slug, shouldPublish }) => publishTutorial({ slug, shouldPublish }),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTutorials();
        queryClient.refetchQueries([GET_TUTORIALS]);
      },
      onError: (err) => openErrorNotification(err),
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

  const onFormSubmit = useMutation(
    (formValues) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array
        if (Array.isArray(formValues[key])) {
          formValues[key].forEach((value) => {
            if (value) formData.append(key, value);
          });
          return;
        }
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("image", selectedImage);

      return updateTutorial(slug, formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        navigate("/cms/tutorial");
        queryClient.refetchQueries([GET_TUTORIALS]);
        refetchTutorials();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <>
      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <CustomPageHeader title={dataSource.title} />
          <div className="px-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between mb-2">
              <ButtonWPermission
                codename="change_tutorial"
                danger={dataSource.is_published}
                loading={handlePublishTutorial.isLoading}
                type="primary"
                onClick={() =>
                  handlePublishTutorial.mutate({
                    slug,
                    shouldPublish: !dataSource.is_published,
                  })
                }
              >
                {dataSource.is_published ? "Unpublish" : "Publish"}
              </ButtonWPermission>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col w-auto">
                <p className="text-lg font-semibold">Details</p>
                <p>Created at: {moment(dataSource.created_at).format("ll")}</p>
                <p>
                  Last edited at:{" "}
                  {moment(dataSource.last_edited_at).format("ll")}
                </p>
                <p>
                  Published at:{" "}
                  {dataSource.published_at
                    ? moment(dataSource.published_at).format("ll")
                    : "Not Published"}
                </p>
                <Tag
                  className="text-center w-fit"
                  color={
                    dataSource.is_published
                      ? getStatusColor(PUBLISHED)
                      : getStatusColor(UNPUBLISHED)
                  }
                >
                  {dataSource.is_published ? "Published" : "Not published"}
                </Tag>
              </div>

              <Card
                actions={[
                  <span
                    key="views"
                    className="flex items-center justify-center gap-5 font-semibold"
                  >
                    <EyeOutlined key="eye" className="mt-0.5" />{" "}
                    {dataSource.views}
                  </span>,

                  <span
                    key="likes"
                    className="flex items-center justify-center gap-5 font-semibold"
                  >
                    <LikeOutlined key="like" className="mt-0.5" />{" "}
                    {dataSource.likes_count}
                  </span>,
                ]}
                cover={
                  <Image
                    className="object-cover"
                    height={100}
                    src={dataSource.image.full_size}
                  />
                }
                style={{
                  width: 300,
                }}
              >
                <Meta
                  description={dataSource.subtitle}
                  title={dataSource.title}
                />
              </Card>
            </div>
            <Form
              autoComplete="off"
              className="w-full grid grid-cols-2 gap-x-8"
              form={form}
              initialValues={{ remember: true }}
              layout="vertical"
              name="basic"
              onFinish={() =>
                form
                  .validateFields()
                  .then((values) => onFormSubmit.mutate(values))
              }
            >
              <Form.Item
                initialValue={dataSource.type}
                label="Type"
                name="type"
              >
                <Select defaultValue={dataSource.type} disabled>
                  <Option value="text">Text</Option>
                  <Option value="video">Video</Option>
                </Select>
              </Form.Item>

              <Form.Item
                initialValue={dataSource.page_location}
                label="Page Location"
                name="page_location"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={dataSource.page_location}
                  placeholder="Select page location"
                  allowClear
                >
                  <Option value="general">General</Option>
                  <Option value="market_intelligence">
                    Market Intelligence
                  </Option>
                </Select>
              </Form.Item>
              {dataSourceTagList && (
                <Form.Item
                  className="col-span-full"
                  initialValue={dataSourceTagList.map((el) => el.data.data.id)}
                  label="Tags"
                  name="tags"
                >
                  <Select
                    defaultValue={dataSourceTagList.map(
                      (el) => el.data.data.id
                    )}
                    mode="multiple"
                    placeholder="Select a tag"
                    allowClear
                  >
                    {tagList?.map((el) => (
                      <Option key={el.id} value={el.id}>
                        {el.tag}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                className="col-span-full"
                initialValue={dataSource.title}
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input title!" }]}
              >
                <Input
                  defaultValue={dataSource.title}
                  placeholder="Enter a title"
                />
              </Form.Item>

              <Form.Item
                className="col-span-full"
                initialValue={dataSource.subtitle}
                label="Subtitle"
                name="subtitle"
                rules={[{ required: true, message: "Please input subtitle!" }]}
              >
                <Input
                  defaultValue={dataSource.subtitle}
                  placeholder="Enter a subtitle"
                />
              </Form.Item>

              {dataSource.type === "video" && (
                <>
                  <Form.Item
                    className="col-span-full"
                    initialValue={dataSource.video_link}
                    label="Video Link"
                    name="video_link"
                    rules={[
                      { required: true, message: "Please input video link!" },
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
                    <Input
                      defaultValue={dataSource.video_link}
                      placeholder="Enter video link"
                      onChange={(e) => setIframeLink(e.target.value)}
                    />
                  </Form.Item>

                  {(iframeLink || dataSource.video_link) && (
                    <iframe
                      className="col-span-full mb-5"
                      height="330"
                      src={
                        iframeLink.replace("watch?v=", "embed/") ||
                        dataSource.video_link.replace("watch?v=", "embed/")
                      }
                      title="Thumbnail Video"
                      width="604"
                    ></iframe>
                  )}
                </>
              )}

              {dataSource.type === "text" && (
                <div className="col-span-full flex justify-between">
                  <Form.Item
                    className="w-[49%]"
                    initialValue={dataSource.content}
                    label="Content"
                    name="content"
                    rules={[
                      { required: true, message: "Please input content" },
                    ]}
                  >
                    <TextArea
                      defaultValue={dataSource.content}
                      autoSize
                      showCount
                      onChange={(e) => setGetMarkdown(e.target.value)}
                    />
                  </Form.Item>
                  <div className="w-[45%]">
                    <p>Preview</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getMarkdown ? getMarkdown : dataSource.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

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

              <Form.Item className="col-span-full">
                <ButtonWPermission
                  codename="change_tutorial"
                  htmlType="submit"
                  loading={onFormSubmit.isLoading}
                  type="primary"
                >
                  Submit
                </ButtonWPermission>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateTutorial;
