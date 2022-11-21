import React, { useEffect } from "react";
import { Select, Table } from "antd";
import { CustomCard } from "../../../components/customCard";
import { PieChart } from "../../../charts/pieChart";
import { useQuery } from "react-query";
import { getBrandAnalytics } from "../../../context/UserContext";

import Loader from "../../../shared/Loader";

const { Option } = Select;

const BrandAnalysis = () => {
  const {
    data: analytics,
    isLoading,
    isSuccess,
  } = useQuery([], async () => getBrandAnalytics());

  const pieData = analytics?.map((x) => ({
    id: x.brand.id,
    label: x.brand.name,
    value: x.amount,
    percentage: x.percentage,
  }));

  return (
    <CustomCard className="col-span-1">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Brands</h2>
        <Select defaultValue="this_month" style={{ width: 120 }}>
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </div>
      <PieChart data={pieData} />
    </CustomCard>
  );
};

export default BrandAnalysis;
