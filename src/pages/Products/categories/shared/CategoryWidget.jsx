import React, { useState } from "react";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function CategoryWidget({
  image,
  title,
  slug,
  completeLink,
  editClick,
  imgClassName,
  selectedCategories,
  setSelectedCategories,
  is_published = false,
}) {
  const [isHovering, setIsHovering] = useState(false);

  const performSelection = () => {
    if (selectedCategories.filter((item) => item.slug === slug).length > 0) {
      setSelectedCategories(
        selectedCategories.filter((item) => item.slug !== slug)
      );
    } else {
      setSelectedCategories([...selectedCategories, { slug, name: title }]);
    }
  };
  return (
    <div
      key={slug}
      className="relative hover:scale-[1.03] transition-all rounded-[8.633px] shadow-[0px_2.46px_12.33px_rgba(135,135,135,0.13)] hover:shadow-[0px_2.46px_12.33px_rgba(135,135,135,0.33)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        key={slug}
        className="w-[222px] h-[210px] bg-[#ffffff] flex flex-col items-center justify-between p-2 "
        to={completeLink}
      >
        <div className="flex-1 w-[100%] flex items-center justify-center">
          <img
            alt={title}
            className={`max-h-[10rem] max-w-[60%] ${
              imgClassName && imgClassName
            }`}
            src={image}
          />
        </div>
        <div className="text-[#596579] text-center font-[600] text-[15px]">
          {title}
        </div>
      </Link>
      {selectedCategories.some((category) => category.slug === slug) && (
        <div
          className="flex justify-between absolute top-0 left-0 w-fit rounded-full text-white hover:text-[#ffffff]"
          role="button"
          onClick={() => {
            performSelection();
          }}
        >
          <span className="absolute top-[0px] left-[0px] flex p-2 animate-categoryEditButton">
            <CheckCircleOutlined
              style={{
                backgroundColor: "#0E9E49",
                borderRadius: "50%",
                fontSize: "1.2rem",
              }}
            />
          </span>
        </div>
      )}
      {isHovering && (
        <>
          <span
            className="flex justify-between absolute top-0 left-0 w-fit rounded-full text-white hover:text-[#ffffff]"
            role="button"
            onClick={() => {
              performSelection();
            }}
          >
            {!selectedCategories.some((category) => category.slug === slug) && (
              <span className="absolute top-[0px] left-[0px] flex p-2 animate-categoryEditButton">
                <CheckCircleOutlined
                  style={{
                    backgroundColor: "white",
                    color: "#0E9E49",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                  }}
                />
              </span>
            )}
          </span>
          <div className="absolute top-[0px] right-[0px] animate-categoryEditButton">
            <div
              className="flex cursor-pointer hover:text-blue-600 justify-between absolute top-0 right-0 w-fit p-2 rounded-full"
              onClick={editClick}
            >
              <EditOutlined />
            </div>
          </div>
        </>
      )}
      {is_published && (
        <div
          className="absolute bottom-[0px] left-[0px] animate-categoryEditButton max-w-[2.5rem] p-2"
          title="Published"
        >
          <img alt="published" className="w-[100%]" src="/published.svg" />
        </div>
      )}
    </div>
  );
}

export default CategoryWidget;
