import React from "react";
import OrderAnalytics from "./OrderAnalytics";
import ProductSkusAnalytics from "./UserProductSkus";
import CategoryAnalysis from "./CategoryAnalysis";
import BrandAnalysis from "./BrandAnalysis";
import { ProductAnalysis } from "./ProductAnalysis";

const UserAnalytics = ({ user }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-x-10">
        <OrderAnalytics user={user} />
        <CategoryAnalysis user={user} />
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <ProductSkusAnalytics user={user} />
        <BrandAnalysis user={user} />
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <ProductAnalysis user={user} />
      </div>
    </div>
  );
};

export default UserAnalytics;
