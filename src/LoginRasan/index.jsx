import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { GET_USER_GROUPS, GET_USER_GROUPS_BY_ID } from "../constants/queryKeys";
import { login, otpRequest } from "../context/LoginContext";
import LoginIcon from "../svgs/LoginIcon";
import RasanLogo from "../svgs/logo.png";
import NepalFlag from "../svgs/nepalFlag.png";

const LoginRasan = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [onOTPReceived, setOnOTPReceived] = useState(false);
  const [number, setNumber] = useState("");
  const { loginFinalise } = useAuth();
  let navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: otpRequestMutate } = useMutation(otpRequest, {
    onSuccess: (data) => {
      message.success(data.message);
      setOnOTPReceived(true);
      setNumber(data.data.phone);
    },
    onError: (err) => message.error(err.response.data?.errors?.detail),
  });

  const { mutate: loginMutate } = useMutation(login, {
    onSuccess: (data) => {
      message.success(data.message);
      loginFinalise(data.data.token, data.data.profile, data.data.groups, () =>
        navigate("/")
      );
      queryClient.refetchQueries(["get-end-user"]);
      queryClient.refetchQueries([GET_USER_GROUPS]);
      queryClient.refetchQueries([GET_USER_GROUPS_BY_ID]);
    },
    onError: (err) => message.error(err.response.data?.errors?.detail),
  });

  const onFinish = (values) => {
    otpRequestMutate({ number: `+977-${values["phone"]}` });
  };

  const onFinishLogin = (values) => {
    loginMutate({ otp: `${values["otp"]}`, phone: number });
  };

  return (
    <div className="sm:h-auto h-screen w-full sm:absolute sm:top-20 flex flex-col sm:justify-start justify-center items-center gap-6">
      <img alt="" className="h-10" src={RasanLogo} />

      <p className="text-xl leading-none my-0">Welcome to Rasan Admin Panel</p>

      <LoginIcon />

      {onOTPReceived ? (
        <Form
          autoComplete="off"
          className="sm:w-80 w-3/4"
          form={form2}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          name="basic"
          requiredMark="off"
          onFinish={onFinishLogin}
        >
          <Form.Item
            className="!mb-3"
            label="Enter your OTP"
            name="otp"
            requiredMark="optional"
            rules={[
              { required: true, message: "Please provide your OTP pin" },
              {
                validator: (_, values) =>
                  values.length !== 6
                    ? Promise.reject("Please provide 6 digit OTP pin")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input className="h-10 !rounded-lg" type="number" />
          </Form.Item>

          <Button
            className="!bg-[#00B0C2] !rounded-lg w-full !text-white"
            htmlType="submit"
            size="large"
          >
            Login
          </Button>
        </Form>
      ) : (
        <Form
          autoComplete="off"
          className="sm:w-80 w-3/4"
          form={form}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            className="!mb-3"
            label="Enter your phone number"
            name="phone"
            requiredMark="optional"
            rules={[
              { required: true, message: "Please provide your phone number" },
              {
                validator: (_, values) =>
                  values?.length !== 10
                    ? Promise.reject("Please provide 10 digit phone number")
                    : Promise.resolve(),
              },
            ]}
          >
            <div className="!flex items-center h-10 border-stone-300 hover:border-blue-400 transition-all duration-300 border-[1.5px] rounded-lg">
              <img alt="" className="object-fit pr-3 pl-4" src={NepalFlag} />

              <p className="my-0 border-stone-300 border-l-[1.5px] h-full flex items-center pl-3">
                +977
              </p>
              <Input bordered={false} type="number" />
            </div>
          </Form.Item>

          <Button
            className="!bg-[#00B0C2] !rounded-lg w-full !text-white"
            htmlType="submit"
            size="large"
          >
            Continue
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginRasan;
