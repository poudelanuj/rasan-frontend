import React from "react";
import BrandAnalytics from "../../../components/Analytics/BrandAnalytics";
import CategoryAnalytics from "../../../components/Analytics/CategoryAnalytics";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";
import ProductAnalytics from "../../../components/Analytics/ProductAnalytics";
import ProductSkuAnalytics from "../../../components/Analytics/ProductSkuAnalytics";

const UserAnalytics = ({ user_id }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-x-10">
        <OrderAnalytics user_id={user_id} />
        <CategoryAnalytics user_id={user_id} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductSkuAnalytics user_id={user_id} />
        <BrandAnalytics user_id={user_id} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductAnalytics user_id={user_id} />
      </div>
    </div>
  );
};

export default UserAnalytics;
