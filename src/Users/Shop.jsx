import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { updateShop } from "../context/UserContext";
import ShopPhotos from "./ShopPhotos";

const Shop = ({ user }) => {
  const [form] = Form.useForm();
  const { mutate: shopMutation } = useMutation(updateShop, {
    onSuccess: (data) => {
      message.success(data);
    },
  });
  useEffect(() => {
    let data = {
      name: user.shop.name,
      pan_vat_number: user.shop.pan_vat_number,
    };
    form.setFieldsValue(data);
  }, [user, form]);
  const onFinish = (values) => {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key]);
    }
    shopMutation({ data: form_data, key: user.id });
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
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
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Pan Vat Number" name="pan_vat_number">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button className="bg-primary" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <ShopPhotos
        name={"citizenship_front"}
        label={"Citizenship Front"}
        url={user.shop.citizenship_front.full_size}
        id={user.id}
      />
      <ShopPhotos
        name={"citizenship_back"}
        label={"Citizenship Back"}
        url={user.shop.citizenship_back.full_size}
        id={user.id}
      />
      <ShopPhotos
        name={"pan_vat_certificate"}
        label={"Pan Vat Certificate"}
        url={user.shop.pan_vat_certificate.full_size}
        id={user.id}
      />
      <ShopPhotos
        name={"house_rent_agreement"}
        label={"House Rent Agreement"}
        url={user.shop.house_rent_agreement.full_size}
        id={user.id}
      />
      <ShopPhotos
        name={"retailer_agreement"}
        label={"Retailer Agreement"}
        url={user.shop.retailer_agreement}
        id={user.id}
      />
    </>
  );
};

export default Shop;
