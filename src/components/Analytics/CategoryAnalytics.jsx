import { useState } from "react";
import { useQuery } from "react-query";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import { AnalysisTimeSelector } from "../AnalysisTimeSelector";
import PieChart from "../../charts/PieChart";
import { CustomCard } from "../CustomCard";
import {
  getCategoryAnalytics,
  getUserCategoryAnalytics,
} from "../../api/analytics";
import { GET_CATEGORY_ANALYTICS } from "../../constants/queryKeys";

const CategoryAnalytics = ({ user_id, address, isAdmin, analytics_type }) => {
  const [date, setDate] = useState("last_year");

  const { data: categoryAnalytics } = useQuery({
    queryFn: () =>
      isAdmin
        ? getCategoryAnalytics({
            user_id,
            address,
            date,
          })
        : getUserCategoryAnalytics({ user_id, date, analytics_type }),
    queryKey: [GET_CATEGORY_ANALYTICS, { user_id, address, date }],
  });

  const pieData = categoryAnalytics?.map((x) => ({
    key: x.category?.id,
    id: x.category?.name,
    label: x.category?.name,
    value: x.amount,
    percentage: x.percentage,
    color: `rgb(${Math.floor(Math.random() * 225)},${Math.floor(
      Math.random() * 225
    )},${Math.floor(Math.random() * 225)})`,
  }));

  return (
    <CustomCard className="col-span-1">
      <span className="flex justify-between mb-10">
        <h2 className="text-xl text-gray-700 mb-0">Categories</h2>

        <AnalysisTimeSelector onChange={setDate} />
      </span>

      {!isEmpty(categoryAnalytics) ? (
        <PieChart data={pieData} type="Category" />
      ) : (
        <Empty />
      )}
    </CustomCard>
  );
};

export default CategoryAnalytics;
