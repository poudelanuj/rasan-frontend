import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import ButtonWPermission from "../../../shared/ButtonWPermission";

function AddCategoryButton({ linkTo, linkText, codeName }) {
  return (
    <ButtonWPermission codeName={codeName}>
      <Link
        className="flex items-center justify-between text-[#00A0B0] font-normal"
        to={linkTo}
      >
        <PlusOutlined /> <span className="ml-1">{linkText}</span>
      </Link>
    </ButtonWPermission>
  );
}

export default AddCategoryButton;
