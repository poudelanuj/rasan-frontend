import React from "react";

export const CustomCard = ({ className, children }) => {
  return (
    <div
      className={`bg-white p-5 rounded-lg shadow-card ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};
