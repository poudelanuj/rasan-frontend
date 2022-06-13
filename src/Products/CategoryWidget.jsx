import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function CategoryWidget({
  id,
  image,
  title,
  slug,
  completeLink,
  imgClassName,
}) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="relative hover:scale-[1.03] transition-all rounded-[8.633px] shadow-[0px_2.46px_12.33px_rgba(135,135,135,0.13)] hover:shadow-[0px_2.46px_12.33px_rgba(135,135,135,0.33)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        to={completeLink}
        className="min-w-[222px] min-h-[210px] bg-[#ffffff] flex flex-col items-center justify-between p-2 "
        key={id}
      >
        <div className="flex-1 w-[100%] flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className={`h-[90%] ${imgClassName && imgClassName}`}
          />
        </div>
        <div className="text-[#596579] text-center font-[600] text-[15px]">
          {title}
        </div>
      </Link>
      {isHovering && (
        <div className="absolute top-[0px] right-[0px] animate-categoryEditButton">
          <Link
            to={`${completeLink}/edit`}
            className="flex justify-between absolute top-0 right-0 w-fit p-2 rounded-full"
          >
            <EditOutlined />
          </Link>
        </div>
      )}
    </div>
  );
}

export default CategoryWidget;
