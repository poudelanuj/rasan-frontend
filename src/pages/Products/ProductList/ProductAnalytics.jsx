import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Select } from "antd";
import { BarChart } from "../../../charts/barChart";
import { CustomCard } from "../../../components/customCard";
import { useQuery } from "react-query";
import { getProductAnalysis } from "../../../context/UserContext";
import Loader from "../../../shared/Loader";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";
import time from "../../../svgs/Time";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Order Bar Chart",
    },
  },
};

const labels = [..."123456789012"];

export const data = {
  labels,
  datasets: [
    {
      label: "Total Amount",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "#00A0B0",
      borderRadius: 16,
      inflateAmount: -20,
    },
  ],
};

const ProductAnalytics = ({ user }) => {
  const [timeStamp, setTimeStamp] = useState("this_month");
  const {
    data: analytics,
    isLoading,
    refetch: refetchList,
  } = useQuery(["product-analysis", timeStamp, { enabled: !!timeStamp }], () =>
    getProductAnalysis(timeStamp)
  );

  useEffect(() => {
    refetchList();
  }, [timeStamp]);

  const barData = analytics?.map((x) => ({
    id: x.product.id,
    count: x.count,
    amount: x.total_amount,
  }));

  return (
    <React.Fragment>
      <h2 className="text-xl text-text mb-8">Product Analytics</h2>
      <CustomCard className="col-span-2">
        <span className="flex justify-between items-center">
          <p className="text-xl text-text mb-0">Order</p>
          <AnalysisTimeSelector onChange={setTimeStamp} />
        </span>

        {/*<Bar data={data} options={options} />*/}
        <div style={{ height: 500 }}>
          {isLoading ? (
            <Loader isOpen />
          ) : (
            <BarChart data={barData} index={"count"} keys={["amount"]} />
          )}
        </div>
      </CustomCard>
    </React.Fragment>
  );
};

export default ProductAnalytics;
