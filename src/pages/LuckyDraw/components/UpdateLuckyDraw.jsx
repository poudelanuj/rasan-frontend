import { Button, Form, Input, Space, Upload } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import {
  archiveLuckyDraw,
  getLuckyDrawById,
  updateLuckyDraw,
} from "../../../api/luckyDraw";
import {
  GET_LUCKY_DRAW,
  GET_LUCKY_DRAW_BY_ID,
} from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import { openSuccessNotification, openErrorNotification } from "../../../utils";
import Loader from "../../../shared/Loader";

const UpdateLuckyDraw = () => {
  const queryClient = useQueryClient();

  const { eventId } = useParams();

  const navigate = useNavigate();

  const { Dragger } = Upload;

  const { TextArea } = Input;

  const [form] = Form.useForm();

  const [selectedImageBanner, setSelectedImageBanner] = useState(null);

  const [selectedImageCoupon, setSelectedImageCoupon] = useState(null);

  const {
    data: luckyDraw,
    refetch: refetchLuckyDraw,
    status,
  } = useQuery({
    queryFn: () => getLuckyDrawById(eventId),
    queryKey: [GET_LUCKY_DRAW_BY_ID, eventId],
    enabled: !!eventId,
  });

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

      return updateLuckyDraw({ id: eventId, data: formData });
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        setSelectedImageBanner(null);
        setSelectedImageCoupon(null);
        queryClient.refetchQueries([GET_LUCKY_DRAW]);
        refetchLuckyDraw();
        navigate(-1);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const handleArchiveLuckyDraw = useMutation(
    ({ id, shouldArchive }) => archiveLuckyDraw({ id, shouldArchive }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchLuckyDraw();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    if (status === "success") {
      form.setFieldsValue({
        title: luckyDraw.title,
        event_date: moment(luckyDraw.event_date).format("YYYY-MM-DD"),
        event_time: moment(luckyDraw.event_date).utc().format("HH:mm:ss.SSS"),
        description: luckyDraw.description,
      });
      setSelectedImageBanner(null);
      setSelectedImageCoupon(null);
    }
  }, [status, luckyDraw, form]);

  return (
    <>
      <CustomPageHeader title="Update Campaigns" />

      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
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
          <div className="p-4 bg-[#FFFFFF] rounded-sm col-span-3">
            <Form.Item label="Campaign Banner">
              <Dragger {...fileUploadOptionsBanner}>
                <p className="ant-upload-drag-icon">
                  <img
                    alt="gallery"
                    className="h-[4rem] mx-auto"
                    src={
                      selectedImageBanner
                        ? URL.createObjectURL(selectedImageBanner)
                        : luckyDraw
                        ? luckyDraw.event_banner.full_size
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

          <div className="p-4 bg-[#FFFFFF] rounded-sm col-span-2">
            <Form.Item label="Coupon Template">
              <Dragger {...fileUploadOptionsCoupon}>
                <p className="ant-upload-drag-icon">
                  <img
                    alt="gallery"
                    className="h-[4rem] mx-auto"
                    src={
                      selectedImageCoupon
                        ? URL.createObjectURL(selectedImageCoupon)
                        : luckyDraw
                        ? luckyDraw.coupon_template.full_size
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

          <div className="bg-[#FFFFFF] p-4 rounded-sm col-span-full grid grid-cols-2 gap-x-4">
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
              <Space>
                <Button
                  htmlType="submit"
                  loading={onFormSubmit.isLoading}
                  type="primary"
                >
                  Save
                </Button>
                <Button
                  danger={luckyDraw.is_archived}
                  loading={handleArchiveLuckyDraw.isLoading}
                  onClick={() =>
                    handleArchiveLuckyDraw.mutate({
                      eventId,
                      shouldArchive: !luckyDraw.is_archived,
                    })
                  }
                >
                  {luckyDraw.is_archived ? "Unarchive" : "Archive"}
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      )}
    </>
  );
};

export default UpdateLuckyDraw;
