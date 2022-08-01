import { Form, Input, Button, Select, Upload } from "antd";
import { useQuery, useMutation } from "react-query";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTutorial, getTutorialTags } from "../../../../api/tutorial";
import CustomPageHeader from "../../../../shared/PageHeader";

const CreateTutorial = () => {
  const { Dragger } = Upload;
  const { Option } = Select;

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [getMarkdown, setGetMarkdown] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [iframeLink, setIframeLink] = useState("");

  const [type, setType] = useState("");

  const { data: tagList } = useQuery({
    queryFn: () => getTutorialTags(),
    queryKey: "taglist",
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
        if (Array.isArray(formValues[key])) {
          formValues[key].forEach((value) => {
            if (value) formData.append(key, value);
          });
          return;
        }
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("image", selectedImage);

      return createTutorial(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        navigate(-1);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <div className="py-5 px-4 bg-[#FFFFFF]">
      <CustomPageHeader title="Create Tutorial" />
      <p className="font-semibold text-lg">Details</p>

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
            .then((values) =>
              onFormSubmit.mutate({ content: getMarkdown, ...values })
            )
        }
      >
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option (Video or Text)"
            allowClear
            onChange={(value) => setType(value)}
          >
            <Option value="text">Text</Option>
            <Option value="video">Video</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Page Location"
          name="page_location"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select page location" allowClear>
            <Option value="general">General</Option>
            <Option value="market_intelligence">Market Intelligence</Option>
          </Select>
        </Form.Item>

        <Form.Item
          className="col-span-full"
          label="Tags"
          name="tags"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select mode="multiple" placeholder="Select a tag" allowClear>
            {tagList?.map((el) => (
              <Option key={el.id} value={el.id}>
                {el.tag}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className="col-span-full"
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className="col-span-full"
          label="Subtitle"
          name="subtitle"
          rules={[{ required: true, message: "Please input subtitle!" }]}
        >
          <Input />
        </Form.Item>

        {type === "video" && (
          <>
            <Form.Item
              className="col-span-full"
              label="Video Link"
              name="video_link"
              rules={[{ required: true, message: "Please input video link!" }]}
            >
              <Input onChange={(e) => setIframeLink(e.target.value)} />
            </Form.Item>

            {iframeLink && (
              <iframe
                className="col-span-full mb-5"
                height="330"
                src={iframeLink.replace("watch?v=", "embed/")}
                title="W3Schools Free Online Web Tutorials"
                width="604"
              ></iframe>
            )}
          </>
        )}

        {type === "text" && (
          <div className="col-span-full mb-5">
            <p>Content</p>
            <Editor
              editorClassName="border-2"
              editorState={editorState}
              onEditorStateChange={(newState) => {
                setEditorState(newState);
                setGetMarkdown(
                  draftToMarkdown(convertToRaw(editorState.getCurrentContent()))
                );
              }}
            />
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
          <Button
            htmlType="submit"
            loading={onFormSubmit.isLoading}
            type="primary"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTutorial;
