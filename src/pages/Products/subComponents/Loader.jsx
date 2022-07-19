import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

function Loader({ loadingText }) {
  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white/90 min-w-[10rem] min-h-[10rem] flex flex-col items-center justify-center z-[999999] animate-popupopen shadow-[0px_0px_20px_rgba(0,0,0,0.05)] rounded-xl">
      <LoadingOutlined style={{ color: "black", fontSize: "3rem" }} />
      <span className="p-2 text-black">{loadingText || "Loading..."}</span>
    </div>
  );
}

export default Loader;
