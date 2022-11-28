import { Button, DatePicker, Form, Input, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";
import {
  deactivateUser,
  logoutUser,
  unVerifyUser,
  updateUser,
  verifyUser,
} from "../../../context/UserContext";
import AddressCreationForm from "./Components/AddressCreationForm";
import AddressForm from "./Components/AddressForm";
import DeleteUser from "./Components/DeleteUser";
import ProfilePicture from "./Components/ProfilePicture";
import Shop from "./Components/Shop";

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
  const { mutate: verifyUserMutate } = useMutation(verifyUser, {
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries(["get-user", `${user.id}`]);
    },
    onError: (data) => {
      message.error(data.message);
    },
  });
  const { mutate: unverifyUserMutate } = useMutation(unVerifyUser, {
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
      message.success(data);
    },
  });
  const { mutate: deactivateUserMutation } = useMutation(deactivateUser, {
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries(["get-user", `${user.id}`]);
    },
  });

  useEffect(() => {
    let data = {
      full_name: user.full_name,
      shop_name: user.shop?.name,
      phone: user.phone.replaceAll("+977-", ""),
      alternate_number: user.alternate_phone?.replaceAll("+977-", ""),
      date_of_birth:
        user.date_of_birth && moment(user.date_of_birth, "YYYY-MM-DD"),
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
  const onFinish = (formValues) => {
    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      // * if form value is an array
      if (Array.isArray(formValues[key])) {
        formValues[key].forEach((value) => {
          if (value) formData.append(key, value);
        });
        return;
      }
      if (formValues[key]) {
        switch (key) {
          case "phone":
            formData.append(key, `+977-${formValues[key]}`);
            break;

          case "alternate_number":
            formData.append(key, `+977-${formValues[key]}`);
            break;

          case "date_of_birth":
            formData.append(
              "date_of_birth",
              moment(formValues.date_of_birth).format("YYYY-MM-DD")
            );
            break;

          default:
            formData.append(key, formValues[key]);
        }
      }
    });

    updateUserMutation({
      data: formData,
      key: user.id,
    });
  };
  const onFinishFailed = (errorInfo) => {};
  return (
    <div className="user-information bg-white p-4 ">
      <div className="user-title-logout flex justify-between m-4">
        <div className="text-gray-700 text-xl">User Information</div>
        <div>
          <Button type="link" onClick={logOut}>
            Log user out
          </Button>
          <Button type="primary" danger onClick={deactivate}>
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
                <Form.Item label="Full Name" name="full_name">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Number"
                  name="phone"
                  rules={[
                    { require: true, message: "Please provide phone number" },
                    {
                      validator: (_, value) =>
                        value.length !== 10
                          ? Promise.reject("Please provide a 10 digit nunber")
                          : Promise.resolve(),
                    },
                  ]}
                >
                  <Input addonBefore="+977" type="number" />
                </Form.Item>
                <Form.Item label="Alternative Number" name="alternate_number">
                  <Input addonBefore="+977" type="number" />
                </Form.Item>
                <Form.Item label="Date of Birth" name="date_of_birth">
                  <DatePicker format={"YYYY-MM-DD"} />
                </Form.Item>

                <Form.Item className="justify-end">
                  <Button
                    className="bg-primary"
                    htmlType="submit"
                    type="primary"
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
          return (
            <AddressForm key={address.id} address={address} id={user.id} />
          );
        })}
        <div>
          <Button
            className="bg-primary w-full text-lg"
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            New Address
          </Button>
          <AddressCreationForm
            id={user.id}
            visible={visible}
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
      <div className="w-7/12 mt-3 flex gap-3">
        <DeleteUser phone={user.phone} title={"Delete User"} />
        <Button
          className="bg-primary !flex gap-1 items-center"
          // disabled={user.is_verified}
          type="primary"
          onClick={() => {
            user.is_verified
              ? unverifyUserMutate({ key: user.id })
              : verifyUserMutate({ key: user.id });
          }}
        >
          <AiFillCheckCircle />
          {user.is_verified ? "Unverify" : "Verify User"}
        </Button>
      </div>
    </div>
  );
};

export default UserInformation;
