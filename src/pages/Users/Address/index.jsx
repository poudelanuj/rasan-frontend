import React from "react";
import CustomPageHeader from "../../../shared/PageHeader";
import Analytics from "./Analytics";

const Address = () => {
  return (
    <React.Fragment>
      <CustomPageHeader title="Address" isBasicHeader />

      <div className="bg-white p-6 rounded-lg">
        <Analytics />
      </div>
    </React.Fragment>
  );
};

export default Address;
