import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import ButtonWPermission from "../../../shared/ButtonWPermission";

function AddCategoryButton({ linkTo, linkText, codename }) {
  return (
    <ButtonWPermission
      className="!text-[#00A0B0] !bg-inherit !border-[#00A0B0] !rounded-md"
      codename={codename}
    >
      <Link className="flex items-center justify-between" to={linkTo}>
        <PlusOutlined /> <span className="ml-1">{linkText}</span>
      </Link>
    </ButtonWPermission>
  );
}

export default AddCategoryButton;
