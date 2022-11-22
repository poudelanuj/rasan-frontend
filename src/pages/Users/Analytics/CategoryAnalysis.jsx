import { useState } from "react";
import { useQuery } from "react-query";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";
import PieChart from "../../../charts/PieChart";
import { getCategoryAnalytics } from "../../../api/analytics";
import { GET_CATEGORY_ANALYTICS } from "../../../constants/queryKeys";

const CategoryAnalysis = ({ user }) => {
  const [date, setDate] = useState("this_month");

  const { data: categoryAnalytics } = useQuery({
    queryFn: () => getCategoryAnalytics({ user_id: user.id, date }),
    queryKey: [GET_CATEGORY_ANALYTICS, { user_id: user.id, date }],
  });

  const pieData = categoryAnalytics?.map((x) => ({
    key: x.category.id,
    type: x.category.name,
    value: x.amount,
    percentage: x.percentage,
  }));

  return (
    <div className="col-span-1">
      <span className="flex justify-between">
        <h2 className="text-xl text-gray-700 mb-0">Categories</h2>

        <AnalysisTimeSelector onChange={setDate} />
      </span>

      {!isEmpty(categoryAnalytics) ? (
        <PieChart data={pieData} type="Category" />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default CategoryAnalysis;
