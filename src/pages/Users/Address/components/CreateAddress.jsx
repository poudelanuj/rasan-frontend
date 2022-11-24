import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Modal, Form, Button, Select, Input, Divider, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  createArea,
  createCity,
  createProvince,
  getAddresses,
} from "../../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../../constants/queryKeys";

const CreateAddress = ({ isCreateAddressOpen, setIsCreateAddressOpen }) => {
  const [form] = Form.useForm();

  const [selectedProvince, setSelectedProvince] = useState(null);

  const [selectedCity, setSelectedCity] = useState(null);

  const [addressInput, setAddressInput] = useState({
    province: "",
    city: "",
    area: "",
  });

  const handleAddressInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setAddressInput({ ...addressInput, [name]: value });
  };

  const {
    data: addressList,
    refetch: refetchAddress,
    status: addressListStatus,
  } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const handleCreateProvince = useMutation((name) => createProvince(name), {
    onSuccess: () => {
      refetchAddress();
      setAddressInput({ ...addressInput, province: "" });
    },
  });

  const handleCreateCity = useMutation(
    ({ name, province }) => createCity({ name, province }),
    {
      onSuccess: () => {
        refetchAddress();
        setAddressInput({ ...addressInput, city: "" });
      },
    }
  );

  const handleCreateArea = useMutation(
    ({ name, city }) => createArea({ name, city }),
    {
      onSuccess: () => {
        refetchAddress();
        setAddressInput({ ...addressInput, area: "" });
      },
    }
  );

  return (
    <Modal
      footer={
        <Button
          htmlType="submit"
          type="primary"
          onClick={() => setIsCreateAddressOpen(false)}
        >
          Done
        </Button>
      }
      title="Create Address"
      visible={isCreateAddressOpen}
      onCancel={() => setIsCreateAddressOpen(false)}
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
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    name="province"
                    placeholder="Enter province"
                    value={addressInput.province}
                    onChange={handleAddressInputChange}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    loading={handleCreateProvince.isLoading}
                    type="primary"
                    onClick={() =>
                      handleCreateProvince.mutate(addressInput.province)
                    }
                  >
                    Add Province
                  </Button>
                </Space>
              </>
            )}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            loading={addressListStatus === "loading"}
            showSearch
            onSelect={(value) => {
              setSelectedProvince(value);
              form.resetFields(["city", "area"]);
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
            dropdownRender={(menu) => (
              <>
                {menu}
                {selectedProvince && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Input
                        name="city"
                        placeholder="Enter city"
                        value={addressInput.city}
                        onChange={handleAddressInputChange}
                      />
                      <Button
                        icon={<PlusOutlined />}
                        loading={handleCreateCity.isLoading}
                        type="primary"
                        onClick={() =>
                          handleCreateCity.mutate({
                            name: addressInput.city,
                            province: selectedProvince,
                          })
                        }
                      >
                        Add City
                      </Button>
                    </Space>
                  </>
                )}
              </>
            )}
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
            dropdownRender={(menu) => (
              <>
                {menu}
                {selectedProvince && selectedCity && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Input
                        name="area"
                        placeholder="Enter area"
                        value={addressInput.area}
                        onChange={handleAddressInputChange}
                      />
                      <Button
                        icon={<PlusOutlined />}
                        loading={handleCreateArea.isLoading}
                        type="primary"
                        onClick={() =>
                          handleCreateArea.mutate({
                            name: addressInput.area,
                            city: selectedCity,
                          })
                        }
                      >
                        Add Area
                      </Button>
                    </Space>
                  </>
                )}
              </>
            )}
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
      </Form>
    </Modal>
  );
};

export default CreateAddress;
