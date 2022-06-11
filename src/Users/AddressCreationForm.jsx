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
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      visible={visible}
      title="Create a new address"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      okButtonProps={{ className: "bg-primary" }}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            form.submit();
            onCancel();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        // onValuesChange={onValuesChanged}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="province"
          label="Province"
          rules={[
            {
              required: true,
              message: "Please select your province!",
            },
          ]}
        >
          <Select
            onChange={onChangeProvince}
            placeholder="Please select a province"
            options={provinces}
          ></Select>
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          rules={[
            {
              required: true,
              message: "Please select your city!",
            },
          ]}
        >
          <Select onChange={onChangeCity} placeholder="Please select a city">
            {!!cities?.length &&
              cities.map((city) => (
                <Select.Option
                  disabled={!city.is_active}
                  value={city.id}
                  key={city.id}
                >
                  {city.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="area"
          label="Area"
          rules={[
            {
              required: true,
              message: "Please select your area!",
            },
          ]}
        >
          <Select onChange={onchange} placeholder="Please select an area">
            {!!areas?.length &&
              areas.map((area) => (
                <Select.Option
                  disabled={!area.is_active}
                  value={area.id}
                  key={area.id}
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
