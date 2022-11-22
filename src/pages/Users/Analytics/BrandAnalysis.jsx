import { useState } from "react";
import { Empty } from "antd";
import { useQuery } from "react-query";
import { isEmpty } from "lodash";
import { CustomCard } from "../../../components/customCard";
import PieChart from "../../../charts/PieChart";
import { getBrandAnalytics } from "../../../api/analytics";
import { GET_BRAND_ANALYTICS } from "../../../constants/queryKeys";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";

const BrandAnalysis = ({ user }) => {
  const [date, setDate] = useState("this_month");

  const { data: brandAnalytics } = useQuery({
    queryFn: () => getBrandAnalytics({ user_id: user.id, date }),
    queryKey: [GET_BRAND_ANALYTICS, { user_id: user.id, date }],
  });

  const pieData = brandAnalytics?.map((x) => ({
    key: x.brand.id,
    type: x.brand.name,
    value: x.amount,
    percentage: x.percentage,
  }));

  return (
    <CustomCard className="col-span-1">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Brands</h2>

        <AnalysisTimeSelector onChange={setDate} />
      </div>
      {!isEmpty(brandAnalytics) ? (
        <PieChart data={pieData} type="Brands" />
      ) : (
        <Empty />
      )}
    </CustomCard>
  );
};

export default BrandAnalysis;
