import { Button, Form, InputNumber, message } from "antd";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { GET_USER_GROUPS, GET_USER_GROUPS_BY_ID } from "../constants/queryKeys";
import { login, otpRequest } from "../context/LoginContext";
import Logo from "../svgs/Logo2";

const LoginRasan = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [onOTPReceived, setOnOTPReceived] = useState(false);
  const [number, setNumber] = useState("");
  const { loginFinalise } = useAuth();
  let location = useLocation();
  let navigate = useNavigate();

  const queryClient = useQueryClient();

  let from = location.state?.from?.pathname || "/";

  const { mutate: otpRequestMutate } = useMutation(otpRequest, {
    onSuccess: (data) => {
      message.success(data.message);
      setOnOTPReceived(true);
      setNumber(data.data.phone);
    },
  });
  const { mutate: loginMutate } = useMutation(login, {
    onSuccess: (data) => {
      message.success(data.message);
      loginFinalise(
        data.data.token,
        data.data.profile,
        data.data.groups,
        () => {
          // Send them back to the page they tried to visit when they were
          // redirected to the login page. Use { replace: true } so we don't create
          // another entry in the history stack for the login page.  This means that
          // when they get to the protected page and click the back button, they
          // won't end up back on the login page, which is also really nice for the
          // user experience.
          navigate(from, { replace: true });
        }
      );
      queryClient.refetchQueries(["get-end-user"]);
      queryClient.refetchQueries([GET_USER_GROUPS]);
      queryClient.refetchQueries([GET_USER_GROUPS_BY_ID]);
    },
  });

  const onFinish = (values) => {
    otpRequestMutate({ number: `+977-${values["phone"]}` });
  };
  const onFinishLogin = (values) => {
    loginMutate({ otp: `${values["otp"]}`, phone: number });
  };
  const onFinishFailed = (errorInfo) => {};
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex-col items-center w-1/3 h-1/2">
        <div className="w-1/3 mx-auto mb-5">
          <Logo />
        </div>
        <div className="text-3xl mb-3 text-center">Rasan Admin Panel</div>
        <div className="text-gray-400 text-center mb-7">
          Welcome back! To login, please enter your details.
        </div>
        {onOTPReceived ? (
          <Form
            autoComplete="off"
            className="flex flex-col items-center max-w-full"
            form={form2}
            initialValues={{
              remember: true,
            }}
            name="basic"
            wrapperCol={{
              span: 16,
            }}
            onFinish={onFinishLogin}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              className="flex justify-between mx-auto max-w-full"
              label={<div>OTP</div>}
              name="otp"
            >
              <InputNumber />
            </Form.Item>

            <Button
              className="bg-primary block w-8/12 mx-auto"
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
          </Form>
        ) : (
          <Form
            autoComplete="off"
            className="flex flex-col items-center justify-center max-w-full"
            form={form}
            initialValues={{
              remember: true,
            }}
            name="basic"
            wrapperCol={{
              span: 16,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              className="flex justify-between mx-auto max-w-full"
              label={<span className="w-fit">Phone Number</span>}
              name="phone"
            >
              <InputNumber addonBefore="+977" className="max-w-[13rem]" />
            </Form.Item>

            <Button
              className="bg-primary block w-8/12 mx-auto"
              htmlType="submit"
              type="primary"
            >
              Request OTP
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LoginRasan;
