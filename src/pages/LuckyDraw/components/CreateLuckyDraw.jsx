import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { createLuckyDraw } from "../../../api/luckyDraw";
import { GET_LUCKY_DRAW } from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import { openSuccessNotification, openErrorNotification } from "../../../utils";

const CreateLuckyDraw = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { Dragger } = Upload;

  const { TextArea } = Input;

  const [form] = Form.useForm();

  const [selectedImageBanner, setSelectedImageBanner] = useState(null);

  const [selectedImageCoupon, setSelectedImageCoupon] = useState(null);

  const fileUploadOptionsBanner = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      if (file) setSelectedImageBanner(file);
      return false;
    },
    onRemove: () => setSelectedImageBanner(null),
  };

  const fileUploadOptionsCoupon = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      if (file) setSelectedImageCoupon(file);
      return false;
    },
    onRemove: () => setSelectedImageCoupon(null),
  };

  const onFormSubmit = useMutation(
    (formValues) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImageBanner)
        formData.append("event_banner", selectedImageBanner);

      if (selectedImageCoupon)
        formData.append("coupon_template", selectedImageCoupon);

      return createLuckyDraw(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        navigate(-1);
        setSelectedImageBanner(null);
        setSelectedImageCoupon(null);
        queryClient.refetchQueries([GET_LUCKY_DRAW]);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <>
      <CustomPageHeader title="Create Campaigns" />

      <Form
        autoComplete="off"
        className="w-full grid grid-cols-5 gap-5"
        form={form}
        initialValues={{ remember: true }}
        layout="vertical"
        name="basic"
        onFinish={() =>
          form.validateFields().then((values) =>
            onFormSubmit.mutate({
              ...values,
              event_date: `${values.event_date} ${values.event_time}`,
            })
          )
        }
      >
        <div className="p-6 bg-[#FFFFFF] rounded-lg col-span-3">
          <Form.Item label="Campaign Banner">
            <Dragger {...fileUploadOptionsBanner}>
              <p className="ant-upload-drag-icon">
                <img
                  alt="gallery"
                  className="h-[4rem] mx-auto"
                  src={
                    selectedImageBanner
                      ? URL.createObjectURL(selectedImageBanner)
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
        </div>

        <div className="p-6 bg-[#FFFFFF] rounded-lg col-span-2">
          <Form.Item label="Coupon Template">
            <Dragger {...fileUploadOptionsCoupon}>
              <p className="ant-upload-drag-icon">
                <img
                  alt="gallery"
                  className="h-[4rem] mx-auto"
                  src={
                    selectedImageCoupon
                      ? URL.createObjectURL(selectedImageCoupon)
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
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-lg col-span-full grid grid-cols-2 gap-x-4">
          <p className="col-span-full font-medium text-base">
            Campaign Details
          </p>
          <Form.Item
            className="col-span-full"
            label="Campaign Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please select title",
              },
            ]}
          >
            <Input placeholder="Campaign Title" />
          </Form.Item>

          <Form.Item
            label="Event Start Date"
            name="event_date"
            rules={[
              {
                required: true,
                message: "Please input event date",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Event Start TIme"
            name="event_time"
            rules={[
              {
                required: true,
                message: "Please input event time",
              },
            ]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            className="col-span-full"
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description",
              },
            ]}
          >
            <TextArea placeholder="Description" style={{ height: 120 }} />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={onFormSubmit.isLoading}
              type="primary"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default CreateLuckyDraw;
