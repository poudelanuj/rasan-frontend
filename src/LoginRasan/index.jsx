import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
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
  let navigate = useNavigate();

  const queryClient = useQueryClient();

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
          navigate("/");
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
    <div className="h-screen flex flex-col sm:pt-48 sm:justify-start justify-center items-center">
      <div className="mx-auto mb-5">
        <Logo />
      </div>
      <div className="text-3xl mb-3 text-center">Rasan Admin Panel</div>
      <div className="text-gray-400 text-center mb-7">
        Welcome back! To login, please enter your details.
      </div>
      {onOTPReceived ? (
        <Form
          autoComplete="off"
          className="flex flex-col items-center sm:w-[34%] w-full"
          form={form2}
          initialValues={{
            remember: true,
          }}
          name="basic"
          requiredMark="off"
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinishLogin}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            className="mx-auto w-[40%] flex justify-center"
            label={"OTP"}
            name="otp"
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
            <Input className="!w-full" type="number" />
          </Form.Item>

          <Button
            className="bg-primary block w-8/12 mx-auto rounded-lg"
            htmlType="submit"
            type="primary"
          >
            Login
          </Button>
        </Form>
      ) : (
        <Form
          autoComplete="off"
          className="flex flex-col items-center justify-center sm:w-[34%] w-full"
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
            className="mx-auto w-3/5 flex justify-center !mb-3"
            label={"Phone Number"}
            name="phone"
            requiredMark="optional"
            rules={[
              { required: true, message: "Please provide your phone number" },
              {
                validator: (_, values) =>
                  values.length !== 10
                    ? Promise.reject("Please provide 10 digit phone number")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              addonBefore="+977"
              className="!w-full rounded-full"
              type="number"
            />
          </Form.Item>

          <Button
            className="block w-8/12 mx-auto"
            htmlType="submit"
            shape="round"
            type="primary"
          >
            Request OTP
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginRasan;
