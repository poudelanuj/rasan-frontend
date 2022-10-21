import { Modal, Form, Input, Button, Select } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createShippingAddress,
  getAddresses,
} from "../../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../../constants/queryKeys";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../../utils/openNotification";

const CreateShippingModal = ({
  isCreateShippingOpen,
  setIsCreateShippingOpen,
  setSelectedShippingAddress,
  userId,
  setUserList,
  refetchUserList,
}) => {
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const { data: addressList, status: addressListStatus } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const handleShippingCreate = useMutation(
    ({ id, data }) => createShippingAddress({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        setIsCreateShippingOpen(false);
        setUserList((prev) => prev.filter((user) => user.id !== userId));
        refetchUserList();
        setSelectedShippingAddress(data.data.id);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      footer={
        <Button
          htmlType="submit"
          loading={handleShippingCreate.status === "loading"}
          type="primary"
          onClick={() =>
            form.validateFields().then((values) => {
              handleShippingCreate.mutate({ id: userId, data: values });
            })
          }
        >
          Create
        </Button>
      }
      title="Create a Shipping Address"
      visible={isCreateShippingOpen}
      onCancel={() => setIsCreateShippingOpen(false)}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          label="Province"
          name="province"
          rules={[
            {
              required: true,
              message: "Please select a province",
            },
          ]}
        >
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            loading={addressListStatus === "loading"}
            showSearch
            onSelect={(value) => {
              setSelectedProvince(value);
              form.resetFields(["city"]);
              form.resetFields(["area"]);
            }}
          >
            {addressList &&
              addressList.map((address) => (
                <Select.Option key={address.id}>{address.name}</Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please select a city",
            },
          ]}
        >
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            loading={addressListStatus === "loading"}
            onSelect={(value) => {
              setSelectedCity(value);
              form.resetFields(["area"]);
            }}
          >
            {addressList &&
              addressList
                .find(
                  (item) => item.id?.toString() === selectedProvince?.toString()
                )
                ?.cities?.map((city) => (
                  <Select.Option key={city.id}>{city.name}</Select.Option>
                ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Area"
          name="area"
          rules={[
            {
              required: true,
              message: "Please input Area",
            },
          ]}
        >
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            loading={addressListStatus === "loading"}
          >
            {addressList &&
              addressList
                .find(
                  (item) => item.id?.toString() === selectedProvince?.toString()
                )
                ?.cities?.find(
                  (item) => item.id?.toString() === selectedCity?.toString()
                )
                ?.areas?.map((area) => (
                  <Select.Option key={area.id}>{area.name}</Select.Option>
                ))}
          </Select>
        </Form.Item>

        <Form.Item label="Detail Address" name="detail_address">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateShippingModal;
