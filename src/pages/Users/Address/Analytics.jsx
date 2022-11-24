import React, { useState } from "react";
import BrandAnalytics from "../../../components/Analytics/BrandAnalytics";
import CategoryAnalytics from "../../../components/Analytics/CategoryAnalytics";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";
import ProductAnalytics from "../../../components/Analytics/ProductAnalytics";
import ProductSkuAnalytics from "../../../components/Analytics/ProductSkuAnalytics";

const Analytics = () => {
  const [address, setAddress] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <span className="w-full flex items-center justify-between">
        <h2 className="text-xl text-gray-700 mb-0">Location Based Analytics</h2>
      </span>

      <div className="grid grid-cols-3 gap-x-10">
        <OrderAnalytics address={address} />
        <CategoryAnalytics address={address} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductSkuAnalytics address={address} />
        <BrandAnalytics address={address} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductAnalytics />
      </div>
    </div>
  );
};

export default Analytics;
