import { useState } from "react";
import { useQuery } from "react-query";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import { AnalysisTimeSelector } from "../AnalysisTimeSelector";
import PieChart from "../../charts/PieChart";
import { CustomCard } from "../CustomCard";
import { getCategoryAnalytics } from "../../api/analytics";
import { GET_CATEGORY_ANALYTICS } from "../../constants/queryKeys";

const CategoryAnalytics = ({ user_id, address }) => {
  const [date, setDate] = useState("this_month");

  const { data: categoryAnalytics } = useQuery({
    queryFn: () =>
      getCategoryAnalytics({
        user_id,
        address,
        date,
      }),
    queryKey: [GET_CATEGORY_ANALYTICS, { user_id, address, date }],
  });

  const pieData = categoryAnalytics?.map((x) => ({
    key: x.category.id,
    type: x.category.name,
    value: x.amount,
    percentage: x.percentage,
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
