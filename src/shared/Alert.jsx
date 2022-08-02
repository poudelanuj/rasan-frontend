import React from "react";
import publishIcon from "../assets/images/publish-icon.svg";
import unpublishIcon from "../assets/images/unpublish-icon.svg";
import deleteIcon from "../assets/images/delete-icon.svg";
import { Modal, Spin } from "antd";
import { ALERT_TYPE } from "../constants";

function Alert({ title, text, isOpen, action, status, alertType, closeModal }) {
  const buttons = {
    info: {
      primary: "bg-[#00A0B0] hover:bg-[#118a95] text-white border-[#D0D7E2]",
      secondary:
        "bg-[#ffffff] hover:bg-[#e8e8e8] text-[#374253] border-[#D0D7E2]",
    },
    warning: {
      primary: "bg-[#FFC107] hover:bg-[#d39f01] text-white",
      secondary: "bg-[#ffffff] hover:bg-[#e8e8e8] text-[#374253]",
    },
    danger: {
      primary: "bg-[#D32F2F] hover:bg-[#a31818] text-white",
      secondary: "bg-[#ffffff] hover:bg-[#e8e8e8] text-[#374253]",
    },
  };

  const getIcon = () => {
    switch (alertType) {
      case ALERT_TYPE.delete:
        return deleteIcon;
      case ALERT_TYPE.unpublish:
        return unpublishIcon;

      default:
        return publishIcon;
    }
  };

  const getButton = (buttonType = "primary") => {
    switch (alertType) {
      case ALERT_TYPE.delete:
        return buttons.danger[buttonType];
      case ALERT_TYPE.unpublish:
        return buttons.warning[buttonType];

      default:
        return buttons.info[buttonType];
    }
  };

  const HeaderImage = () => {
    if (status === "loading") return <Spin className="my-4" size="large" />;

    return (
      <div className="w-[25%]">
        <img alt="alert" className="w-full" src={getIcon()} />
      </div>
    );
  };

  const SecondaryButton = () => {
    return (
      <button
        className={`transition-colors min-w-[148px] font-[600] text-[15px] p-[10px] border-[1px] rounded-[4px] ${getButton(
          "secondary"
        )}`}
        onClick={closeModal}
      >
        Cancel
      </button>
    );
  };

  const PrimaryButton = () => {
    return (
      <button
        className={`transition-colors min-w-[148px] font-[600] text-[15px] p-[10px] border-[1px] rounded-[4px] ml-[20px] ${getButton(
          "primary"
        )}`}
        onClick={handleAction}
      >
        Confirm
      </button>
    );
  };

  const handleAction = () => action();

  return (
    <Modal footer={false} title={title} visible={isOpen} onCancel={closeModal}>
      <div className=" flex flex-col items-center justify-between p-[33px] rounded-[10px]">
        <HeaderImage />
        <p className="text-[#596579] text-center font-[400] text-[14px] mt-4">
          {text}
        </p>
        <div className="flex justify-center mt-6">
          <SecondaryButton />
          <PrimaryButton />
        </div>
      </div>
    </Modal>
  );
}

export default Alert;
