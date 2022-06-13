import { Form, Input, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createAddress, getAllProvinces } from "../context/UserContext";

const AddressCreationForm = ({ visible, onCancel, id }) => {
  const [form] = Form.useForm();
  const { data: provincesList } = useQuery("get-provinces", getAllProvinces);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const queryClient = useQueryClient();

  const { mutate: addressMutation } = useMutation(createAddress, {
    onSuccess: (data) => {
      message.success(data);
      queryClient.invalidateQueries(["get-user", `${id}`]);
    },
  });
  useEffect(() => {
    setProvinces(
      provincesList?.map((province) => {
        return {
          label: province.name,
          value: province.id,
          disabled: !province.is_active,
        };
      })
    );
  }, [provincesList]);

  const onChangeProvince = (e) => {
    form.setFieldsValue({ city: null, area: null });
    setCities(provincesList.find((province) => province.id === e).cities);
  };

  const onChangeCity = (e) => {
    form.setFieldsValue({ area: null });
    setAreas(cities.find((city) => city.id === e).areas);
  };

  const onFinish = (values) => {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key]);
    }
    addressMutation({ data: form_data, key: id });
  };
  const onFinishFailed = (errorInfo) => {};
  return (
    <Modal
      cancelText="Cancel"
      okButtonProps={{ className: "bg-primary" }}
      okText="Create"
      title="Create a new address"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            form.submit();
            onCancel();
          })
          .catch((info) => {});
      }}
    >
      <Form
        autoComplete="off"
        form={form}
        initialValues={{
          remember: true,
        }}
        labelCol={{
          span: 8,
        }}
        name="basic"
        // onValuesChange={onValuesChanged}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Province"
          name="province"
          rules={[
            {
              required: true,
              message: "Please select your province!",
            },
          ]}
        >
          <Select
            options={provinces}
            placeholder="Please select a province"
            onChange={onChangeProvince}
          ></Select>
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please select your city!",
            },
          ]}
        >
          <Select placeholder="Please select a city" onChange={onChangeCity}>
            {!!cities?.length &&
              cities.map((city) => (
                <Select.Option
                  key={city.id}
                  disabled={!city.is_active}
                  value={city.id}
                >
                  {city.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Area"
          name="area"
          rules={[
            {
              required: true,
              message: "Please select your area!",
            },
          ]}
        >
          <Select placeholder="Please select an area" onChange={onchange}>
            {!!areas?.length &&
              areas.map((area) => (
                <Select.Option
                  key={area.id}
                  disabled={!area.is_active}
                  value={area.id}
                >
                  {area.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="Detail Address" name="detail_address">
          <Input />
        </Form.Item>
        <Form.Item label="Longitude" name="map_longitude">
          <Input />
        </Form.Item>
        <Form.Item label="Latitude" name="map_latitude">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressCreationForm;
