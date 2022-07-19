import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

function AddCategoryButton({ linkTo, linkText }) {
  return (
    <Link
      className="text-[#00A0B0] font-normal border-[1px] border-[#00A0B0] py-1 px-4 rounded-md flex items-center justify-between"
      to={linkTo}
    >
      <PlusOutlined /> <span className="ml-1">{linkText}</span>
    </Link>
  );
}

export default AddCategoryButton;
