import { Upload, Form, Input, Select, Button, Space, Tag } from "antd";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { uniqBy } from "lodash";
import { useAuth } from "../../../../AuthProvider";
import { createTicket } from "../../../../api/crm/tickets";
import { getOrders } from "../../../../api/orders";
import { getUsers, getAdminUsers } from "../../../../api/users";
import {
  TICKET_STATUS,
  TICKET_STATUS_NEW,
  TICKET_TYPES,
  TICKET_TYPE_CANCEL,
  TICKET_TYPE_RETURN,
} from "../../../../constants";
import {
  GET_ORDERS,
  GET_USERS,
  GET_ADMIN_USER,
} from "../../../../constants/queryKeys";
import Loader from "../../../../shared/Loader";
import CustomPageHeader from "../../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const CreateReturnTicket = () => {
  const { userGroupIds } = useAuth();
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedType, setSelectedType] = useState(TICKET_TYPE_RETURN);
  const { Dragger } = Upload;
  const navigate = useNavigate();

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

  const { data: orders, status: ordersStatus } = useQuery({
    queryFn: () => getOrders(),
    queryKey: [GET_ORDERS],
  });

  const [generalPage, setGeneralPage] = useState(1);

  const [generalUsers, setGeneralUsers] = useState([]);

  const {
    data: dataGeneral,
    refetch: refetchGeneral,
    status: generalStatus,
  } = useQuery({
    queryFn: () => getUsers(generalPage, "", 100),
    queryKey: [GET_USERS, generalPage.toString()],
  });

  useEffect(() => {
    if (dataGeneral)
      setGeneralUsers((prev) =>
        uniqBy([...prev, ...dataGeneral.results], "id")
      );
  }, [dataGeneral]);

  useEffect(() => {
    refetchGeneral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalPage]);

  const [adminPage, setAdminPage] = useState(1);

  const [adminUsers, setAdminUsers] = useState([]);

  const {
    data: dataAdmin,
    refetch: refetchAdmin,
    status: adminStatus,
  } = useQuery({
    queryFn: () => userGroupIds && getAdminUsers(userGroupIds, adminPage, 100),
    queryKey: [GET_ADMIN_USER, userGroupIds, adminPage.toString()],
    enabled: !!userGroupIds,
  });

  useEffect(() => {
    if (dataAdmin)
      setAdminUsers((prev) => uniqBy([...prev, ...dataAdmin.results], "id"));
  }, [dataAdmin]);

  useEffect(() => {
    refetchAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminPage]);

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

      return createTicket(formData);
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
      <Loader isOpen={onFormSubmit.status === "loading"} />

      <div className="py-5">
        <CustomPageHeader title="Create Return Ticket" />

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
              label="Title"
              name="title"
              rules={[{ required: true, message: "title required" }]}
            >
              <Input />
            </Form.Item>

            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Customer (Initiator)"
                name="initiator"
                rules={[{ required: true, message: "customer required" }]}
              >
                <Select
                  loading={generalStatus === "loading"}
                  placeholder="Select Initiator"
                  allowClear
                  onPopupScroll={() =>
                    dataGeneral?.next && setGeneralPage((prev) => prev + 1)
                  }
                >
                  {generalUsers &&
                    generalUsers.map((user) => (
                      <Select.Option key={user.id} value={user.phone}>
                        {user.full_name
                          ? `${user.full_name} (${user.phone})`
                          : user.phone}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item label="Assigned to" name="assigned_to">
                <Select
                  loading={adminStatus === "loading"}
                  placeholder="Select Assigned To"
                  allowClear
                  onPopupScroll={() =>
                    dataAdmin?.next && setAdminPage((prev) => prev + 1)
                  }
                >
                  {adminUsers &&
                    adminUsers.map((user) => (
                      <Select.Option key={user.id} value={user.phone}>
                        {user.full_name
                          ? `${user.full_name} (${user.phone})`
                          : user.phone}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>

            <div
              className={`grid gap-2 grid-cols-${
                selectedType === TICKET_TYPE_RETURN ||
                selectedType === TICKET_TYPE_CANCEL
                  ? "3"
                  : "2"
              }`}
            >
              <Form.Item
                initialValue={TICKET_STATUS_NEW}
                label="Ticket Status"
                name="status"
                rules={[{ required: true, message: "ticket status required" }]}
              >
                <Select
                  defaultValue={TICKET_STATUS_NEW}
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
                initialValue={TICKET_TYPE_RETURN}
                label="Ticket Type"
                name="type"
                rules={[{ required: true, message: "ticket type required" }]}
              >
                <Select
                  defaultValue={TICKET_TYPE_RETURN}
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

              {(selectedType === TICKET_TYPE_RETURN ||
                selectedType === TICKET_TYPE_CANCEL) && (
                <Form.Item
                  label="Order"
                  name="order"
                  rules={[{ required: true, message: "order required" }]}
                >
                  <Select
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
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </div>

            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button htmlType="submit" size="large" type="primary">
                  Create
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateReturnTicket;
