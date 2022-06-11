import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { deactivateUser, logoutUser, updateUser } from "../context/UserContext";
import AddressForm from "./AddressForm";
import ProfilePicture from "./ProfilePicture";
import Shop from "./Shop";
import moment from "moment";
import AddressCreationForm from "./AddressCreationForm";

const UserInformation = ({ user }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: updateUserMutation } = useMutation(updateUser, {
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries(["get-user", `${user.id}`]);
    },
    onError: (data) => {
      message.error(data.message);
    },
  });
  const { mutate: logOutUserMutation } = useMutation(logoutUser, {
    onSuccess: (data) => {
      console.log(data);
      message.success(data);
    },
  });
  const { mutate: deactivateUserMutation } = useMutation(deactivateUser, {
    onSuccess: (data) => {
      message.success(data.message);
    },
  });
  useEffect(() => {
    let data = {
      full_name: user.full_name,
      shop_name: user.shop?.name,
      number: user.phone,
      alternate_number: user.alternate_phone,
      date_of_birth: moment(user.date_of_birth, "YYYY-MM-DD"),
    };
    user.addresses.forEach((address, index) => {
      data[`address-${index + 1}`] = address.detail_address;
    });
    form.setFieldsValue(data);
  }, [user, form]);
  const logOut = () => {
    logOutUserMutation(user.phone);
  };
  const deactivate = () => {
    deactivateUserMutation(user.phone);
  };
  const onFinish = (values) => {
    console.log(values);
    const form_data = new FormData();
    for (let key in values) {
      if (key !== "date_of_birth") form_data.append(key, values[key]);
    }
    form_data.append(
      "date_of_birth",
      moment(values.date_of_birth).format("YYYY-MM-DD")
    );
    updateUserMutation({ data: form_data, key: user.id });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="user-information bg-white p-4 ">
      <div className="user-title-logout flex justify-between m-4">
        <div className="text-gray-700 text-xl">User Information</div>
        <div>
          <Button type="link" onClick={logOut}>
            Log user out
          </Button>
          <Button type="primary" onClick={deactivate} danger>
            Deactivate User
          </Button>
        </div>
      </div>
      <div className="mid-section flex">
        <div className="main-section w-7/12 border p-5 border-primary">
          <div className="profile-section flex justify-between">
            <div className="picture mt-8 w-3/12">
              <ProfilePicture user={user} />
            </div>
            <div className="detail-form flex-1 flex-col flex ">
              {/* <Button className="ml-auto" type="link">
                Edit Profile Picture
              </Button> */}
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
                <Form.Item label="Full Name" name="full_name">
                  <Input />
                </Form.Item>
                <Form.Item label="Number" name="number">
                  <Input />
                </Form.Item>
                <Form.Item label="Alternative Number" name="alternate_number">
                  <Input />
                </Form.Item>
                <Form.Item label="Date of Birth" name="date_of_birth">
                  <DatePicker format={"YYYY-MM-DD"} />
                </Form.Item>

                <Form.Item className="justify-end">
                  <Button
                    className="bg-primary"
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>

        <div className="cash-section w-4/12 mx-auto">
          <div className="flex ">
            <div className="w-1/2 border p-4 bg-[#F8FAFF] text-sm text-light_text">
              Rasan Cash
              <div className="text-2xl text-[#1A63F4]">Rs. 1500</div>
            </div>
            <div className="w-1/2 border p-4 bg-[#F2FFF8] text-sm text-light_text">
              Total Margin Earned
              <div className="text-2xl text-[#0E9E49]">Rs. 1500</div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 border p-4 bg-[#FFFCF3] text-sm text-light_text">
              Total Items Ordered
              <div className="text-2xl text-[#FF6F00]">1500</div>
            </div>
            <div className="w-1/2 border p-4 bg-[#F1FEFF] text-sm text-light_text">
              Total Transaction
              <div className="text-2xl text-primary">Rs. 1500</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-form w-7/12 border mt-3 p-3 border-primary flex-col flex ">
        <div className="text-gray-700 text-xl">Addresses</div>
        {user?.addresses.map((address) => {
          return <AddressForm address={address} key={address.id} />;
        })}
        <div>
          <Button
            type="primary"
            className="bg-primary w-full text-lg"
            onClick={() => {
              setVisible(true);
            }}
          >
            New Address
          </Button>
          <AddressCreationForm
            visible={visible}
            id={user.id}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </div>
      </div>
      <div className="detail-form w-7/12 border mt-3 p-3 border-primary flex-col flex ">
        <div className="text-gray-700 text-xl">Shop Information</div>
        <Shop user={user} />
      </div>
      {/* <div className="image-section w-7/12 border p-5 mt-3 border-primary">
        <div className="text-gray-700 text-xl mb-4">Images</div>
        <div className="flex">
          <img
            src={user.profile_picture.medium_square_crop}
            className="w-2/12 mr-2"
            // style={{ borderRadius: "50%" }}
            // width={180}
            alt={user.full_name}
          />
          <img
            src={user.shop.citizenship_front.full_size}
            className="w-2/12 mr-2"
            // style={{ borderRadius: "50%" }}
            // width={180}
            alt={user.full_name}
          />
          <img
            src={user.shop.citizenship_back.full_size}
            className="w-2/12 mr-2"
            // style={{ borderRadius: "50%" }}
            // width={180}
            alt={user.full_name}
          />
          <img
            src={user.shop.pan_vat_certificate.full_size}
            className="w-2/12 mr-2"
            // style={{ borderRadius: "50%" }}
            // width={180}
            alt={user.full_name}
          />
          <img
            src={user.shop.house_rent_agreement.full_size}
            className="w-2/12 mr-2"
            // style={{ borderRadius: "50%" }}
            // width={180}
            alt={user.full_name}
          />
        </div>
      </div> */}
      <div className="w-7/12 mt-3 flex">
        <Button className="ml-auto w-2/12" type="primary" danger>
          Delete User
        </Button>
      </div>
    </div>
  );
};

export default UserInformation;
