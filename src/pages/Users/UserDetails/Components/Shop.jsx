import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { updateShop } from "../../../../context/UserContext";
import ShopPhotos from "./ShopPhotos";

const Shop = ({ user }) => {
  const [form] = Form.useForm();
  const { mutate: shopMutation } = useMutation(updateShop, {
    onSuccess: (data) => {
      message.success(data.message);
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
  };
  const onFinishFailed = (errorInfo) => {};
  return (
    <>
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
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Pan Vat Number" name="pan_vat_number">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button className="bg-primary" htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <ShopPhotos
        id={user.id}
        label={"Citizenship Front"}
        name={"citizenship_front"}
        url={user.shop.citizenship_front.full_size}
      />
      <ShopPhotos
        id={user.id}
        label={"Citizenship Back"}
        name={"citizenship_back"}
        url={user.shop.citizenship_back.full_size}
      />
      <ShopPhotos
        id={user.id}
        label={"Pan Vat Certificate"}
        name={"pan_vat_certificate"}
        url={user.shop.pan_vat_certificate.full_size}
      />
      <ShopPhotos
        id={user.id}
        label={"House Rent Agreement"}
        name={"house_rent_agreement"}
        url={user.shop.house_rent_agreement.full_size}
      />
      <ShopPhotos
        id={user.id}
        label={"Retailer Agreement"}
        name={"retailer_agreement"}
        url={user.shop.retailer_agreement}
      />
    </>
  );
};

export default Shop;
