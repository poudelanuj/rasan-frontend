import React from "react";

import { RadiusBottomrightOutlined } from "@ant-design/icons";
import { Button, notification, Space } from "antd";
import { useEffect } from "react";

function Notification({ text, title, placement = "bottomRight" }) {
  const openNotification = (placement) => {
    notification.info({
      message: `${title || "Notification"}`,
      description: text || "Some descriptions",
      placement,
    });
  };
  useEffect(() => {
    openNotification(placement);
  }, [text, title, placement]);
  return (
    <>
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification(placement)}
          icon={<RadiusBottomrightOutlined />}
          className="hidden"
        >
          bottomRight
        </Button>
      </Space>
    </>
  );
}

export default Notification;
