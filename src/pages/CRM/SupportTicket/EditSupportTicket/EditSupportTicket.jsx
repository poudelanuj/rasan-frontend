import { Upload, Form, Input, Select, Button, Space, Tag } from "antd";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getTicket, updateTicket } from "../../../../api/crm/tickets";
import { getOrders } from "../../../../api/orders";
import { getUsers } from "../../../../api/users";
import {
  TICKET_STATUS,
  TICKET_TYPES,
  TICKET_TYPE_CANCEL,
  TICKET_TYPE_RETURN,
} from "../../../../constants";
import {
  GET_ORDERS,
  GET_TICKET,
  GET_USERS,
} from "../../../../constants/queryKeys";
import Loader from "../../../../shared/Loader";
import CustomPageHeader from "../../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const EditSupportTicket = () => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const { Dragger } = Upload;
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [searchParam] = useSearchParams();

  useEffect(() => {
    const ticketType = searchParam.get("ticketType");
    if (ticketType === TICKET_TYPE_RETURN || ticketType === TICKET_TYPE_CANCEL)
      setSelectedType(TICKET_TYPE_RETURN);
  }, [searchParam]);

  const fileUploadOptions = {
    maxCount: 6,
    multiple: true,
    showUploadList: true,
    beforeUpload: (file) => {
      if (file) setSelectedImage((prev) => [...prev, file]);
      return false;
    },
    onRemove: () => setSelectedImage([]),
  };

  const { data: users, status: usersStatus } = useQuery({
    queryFn: () => getUsers(),
    queryKey: [GET_USERS],
  });

  const { data: orders, status: ordersStatus } = useQuery({
    queryFn: () => getOrders(),
    queryKey: [GET_ORDERS],
  });

  const { data: ticket, status: ticketStatus } = useQuery({
    queryFn: () => getTicket(ticketId),
    queryKey: [GET_TICKET, ticketId],
    enabled: !!ticketId,
  });

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
      if (selectedImage?.length)
        selectedImage.forEach((file, index) =>
          formData.append(`image${index + 1}`, file)
        );

      return updateTicket(ticket?.id, formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Ticket Created");
        navigate(-1);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <>
      <Loader
        isOpen={onFormSubmit.status === "loading" || ticketStatus === "loading"}
      />

      <div className="py-5">
        <CustomPageHeader
          path={searchParam.get("headerPath")}
          title={
            searchParam.get("ticketType") === TICKET_TYPE_RETURN
              ? searchParam.get("headerTitle") + " #" + searchParam.get("id")
              : `Edit Support Ticket #${ticketId}`
          }
        />

        <div>
          <Form
            layout="vertical"
            onFinish={(values) => onFormSubmit.mutate(values)}
          >
            <Form.Item label="Images">
              <Dragger {...fileUploadOptions}>
                <p className="ant-upload-drag-icon">
                  <img
                    alt="gallery"
                    className="h-[4rem] mx-auto"
                    src={
                      selectedImage?.length
                        ? URL.createObjectURL(selectedImage[0])
                        : "/gallery-icon.svg"
                    }
                  />
                </p>
                <p className="ant-upload-text ">
                  <span className="text-gray-500">
                    click or drag file to this area to upload
                  </span>
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item
              initialValue={ticket?.title}
              label="Title"
              name="title"
              rules={[{ required: true, message: "title required" }]}
            >
              <Input defaultValue={ticket?.title} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                initialValue={ticket?.initiator?.phone}
                label="Customer (Initiator)"
                name="initiator"
                rules={[{ required: true, message: "customer required" }]}
              >
                <Select
                  defaultValue={ticket?.initiator?.phone}
                  loading={usersStatus === "loading"}
                  placeholder="Select Initiator"
                  allowClear
                >
                  {users &&
                    users.map((user) => (
                      <Select.Option key={user.id} value={user.phone}>
                        {user.full_name} {user.phone}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                initialValue={ticket?.assigned_to?.phone}
                label="Assigned to"
                name="assigned_to"
              >
                <Select
                  defaultValue={ticket?.assigned_to?.phone}
                  loading={usersStatus === "loading"}
                  placeholder="Select Assigned To"
                  allowClear
                >
                  {users &&
                    users.map((user) => (
                      <Select.Option key={user.id} value={user.phone}>
                        {user.full_name} {user.phone}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>

            <div
              className={`grid gap-2 grid-cols-${
                (searchParam.get("ticketType") === TICKET_TYPE_RETURN ||
                  searchParam.get("ticketType") === TICKET_TYPE_CANCEL) &&
                (selectedType === TICKET_TYPE_RETURN ||
                  selectedType === TICKET_TYPE_CANCEL)
                  ? "3"
                  : "2"
              }`}
            >
              <Form.Item
                initialValue={ticket?.status}
                label="Ticket Status"
                name="status"
                rules={[{ required: true, message: "ticket status required" }]}
              >
                <Select
                  defaultValue={ticket?.status}
                  placeholder="Select Status"
                  allowClear
                >
                  {TICKET_STATUS.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                initialValue={ticket?.type}
                label="Ticket Type"
                name="type"
                rules={[{ required: true, message: "ticket type required" }]}
              >
                <Select
                  defaultValue={ticket?.type}
                  placeholder="Select Type"
                  allowClear
                  onChange={(value) => setSelectedType(value)}
                >
                  {TICKET_TYPES.map((type) => (
                    <Select.Option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {(searchParam.get("ticketType") === TICKET_TYPE_RETURN ||
                searchParam.get("ticketType") === TICKET_TYPE_CANCEL) &&
                (selectedType === TICKET_TYPE_RETURN ||
                  selectedType === TICKET_TYPE_CANCEL) && (
                  <Form.Item
                    initialValue={ticket?.order}
                    label="Order"
                    name="order"
                    rules={[{ required: true, message: "order required" }]}
                  >
                    <Select
                      defaultValue={ticket?.order}
                      loading={ordersStatus === "loading"}
                      placeholder="Select Order"
                      allowClear
                    >
                      {orders &&
                        orders.map((order) => (
                          <Select.Option key={order.id} value={order.id}>
                            <Space>
                              <span className="text-blue-500">#{order.id}</span>
                              <span>{order.user}</span>
                              <Tag>{order.status.replaceAll("_", " ")}</Tag>
                            </Space>
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}
            </div>

            <div>
              <Form.Item
                initialValue={ticket?.description}
                label="Description"
                name="description"
              >
                <Input.TextArea defaultValue={ticket?.description} rows={4} />
              </Form.Item>
            </div>

            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button htmlType="submit" size="large" type="primary">
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditSupportTicket;
