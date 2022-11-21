import { useState } from "react";
import { Select } from "antd";
import { CustomCard } from "../../../components/customCard";
import { PieChart } from "../../../charts/pieChart";
import { useQuery } from "react-query";
import { getBrandAnalytics } from "../../../api/analytics";
import { GET_BRAND_ANALYTICS } from "../../../constants/queryKeys";

const { Option } = Select;

const BrandAnalysis = ({ user }) => {
  const [date, setDate] = useState("this_month");

  const { data: brandAnalytics } = useQuery({
    queryFn: () => getBrandAnalytics({ user_id: user.id, date }),
    queryKey: [GET_BRAND_ANALYTICS, { user_id: user.id, date }],
  });

  const pieData = brandAnalytics?.map((x) => ({
    id: x.brand.id,
    label: x.brand.name,
    value: x.amount,
    percentage: x.percentage,
  }));

  return (
    <CustomCard className="col-span-1">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Brands</h2>
        <Select
          defaultValue="this_month"
          style={{ width: 120 }}
          onChange={(val) => setDate(val)}
        >
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
