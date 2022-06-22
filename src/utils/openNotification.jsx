import { notification } from "antd";

export const openErrorNotification = (error) => {
  notification.open({
    className: "bg-red-500 text-white",
    message: <div className="text-white">{error?.response?.data?.message}</div>,
    description: error?.response?.data?.errors?.status?.join(". ")?.toString(),
  });
};

export const openSuccessNotification = (message) => {
  notification.open({
    className: "bg-green-500 text-white",
    message: <div className="text-white">{message}</div>,
  });
};
