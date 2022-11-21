import { useState } from "react";
import { useQuery } from "react-query";
import { Select } from "antd";
import { getCategoryAnalytics } from "../../../api/analytics";
import { GET_CATEGORY_ANALYTICS } from "../../../constants/queryKeys";
import { PieChart } from "../../../charts/pieChart";

const CategoryAnalysis = ({ user }) => {
  const { Option } = Select;

  const [date, setDate] = useState("this_month");

  const { data: categoryAnalytics } = useQuery({
    queryFn: () => getCategoryAnalytics({ user_id: user.id, date }),
    queryKey: [GET_CATEGORY_ANALYTICS, { user_id: user.id, date }],
  });

  const pieData = categoryAnalytics?.map((x) => ({
    id: x.category.id,
    label: x.category.name,
    value: x.amount,
    percentage: x.percentage,
  }));

  return (
    <div className="col-span-1">
      <span className="flex justify-between">
        <h2 className="text-xl text-gray-700 mb-0">Categories</h2>
        <Select
          defaultValue="this_month"
          style={{ width: 120 }}
          onChange={(val) => setDate(val)}
        >
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </span>

      <PieChart data={pieData} />
    </div>
  );
};

export default CategoryAnalysis;
