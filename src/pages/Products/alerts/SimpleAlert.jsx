import React from "react";

function SimpleAlert({
  title,
  text,
  type,
  primaryButton,
  secondaryButton,
  image,
  alert,
  setAlert,
  action,
}) {
  const props = {
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
  return (
    <div className="fixed top-0 right-0 w-[100%] h-screen bg-[rgba(0,0,0,0.3)] z-[99999999] flex items-center justify-center animate-popupopen">
      <div className="w-[400px] h-[370px] bg-[#ffffff] flex flex-col items-center justify-between p-[33px] rounded-[10px]">
        <div className="w-[25%]">
          <img alt="alert" className="w-[100%]" src={image} />
        </div>
        <p className="text-[#192638] text-center font-[500] text-[24px]">
          {title}
        </p>
        <p className="text-[#596579] text-center font-[400] text-[14px]">
          {text}
        </p>
        <div className="flex justify-center">
          <button
            className={`transition-colors min-w-[148px] font-[600] text-[15px] p-[10px] border-[1px] rounded-[4px] ${props[type].secondary}`}
            onClick={() => setAlert({ ...alert, show: false })}
          >
            {secondaryButton}
          </button>
          <button
            className={`transition-colors min-w-[148px] font-[600] text-[15px] p-[10px] border-[1px] rounded-[4px] ml-[20px] ${props[type].primary}`}
            onClick={async () => {
              setAlert({ ...alert, show: false });
              if (action) {
                await action();
              }
              return true;
            }}
          >
            {primaryButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleAlert;
