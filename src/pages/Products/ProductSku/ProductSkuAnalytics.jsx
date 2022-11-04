import { Divider, Select, Space } from "antd";
import { BarChart } from "../../../charts/barChart";
import { LineChart } from "../../../charts/lineChart";
import { CustomCard } from "../../../components/customCard";
import { useQuery } from "react-query";
import { getProductSkuAnalysis } from "../../../context/UserContext";
import Loader from "../../../shared/Loader";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";
import { useEffect, useState } from "react";

/* export const getGradient = (ctx, chartArea) => {
  let width, height, gradient;
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.5, "green");
    gradient.addColorStop(1, "blue");
  }

  return gradient;
};*/

const ProductSkuAnalytics = () => {
  const [timeStamp, setTimeStamp] = useState("this_month");
  const { Option } = Select;

  const {
    data: productData,
    isLoading,
    refetch: refetchList,
  } = useQuery(["product-analysis", timeStamp, { enabled: !!timeStamp }], () =>
    getProductSkuAnalysis(2, timeStamp)
  );

  useEffect(() => {
    refetchList();
  }, [timeStamp]);

  return (
    <div className="p-6 rounded-lg flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-x-10 mb-10">
        <CustomCard className="col-span-2">
          <span className="flex justify-between">
            <h2 className="text-xl">Product SKU Analytics</h2>
            <AnalysisTimeSelector onChange={setTimeStamp} />
          </span>

          <div className="h-auto" style={{ height: 400 }}>
            {isLoading ? (
              <Loader isOpen />
            ) : (
              <BarChart
                data={productData.sort((a, b) => b.count - a.count)}
                keys={["total_amount"]}
                index={"count"}
              />
            )}
          </div>
        </CustomCard>
      </div>
      <div className="grid grid-cols-3 gap-x-10 mb-10">
        <CustomCard className="col-span-2">
          <span className="flex justify-between">
            <h2 className="text-xl">Inventory</h2>
            <Select defaultValue="this_month" style={{ width: 120 }}>
              <Option value="today">Today</Option>
              <Option value="this_month">This Month</Option>
              <Option value="last_year">Last Year</Option>
            </Select>
          </span>
          <div className="h-fit" style={{ height: 400 }}>
            <LineChart />
          </div>
        </CustomCard>
      </div>
    </div>
  );
};

export default ProductSkuAnalytics;
