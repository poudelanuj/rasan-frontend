import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useQuery } from "react-query";
import { Select } from "antd";
import { getBrandAnalytics } from "../../../api/analytics";
import { GET_BRAND_ANALYTICS } from "../../../constants/queryKeys";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 20,
      },
    },
    title: {
      display: true,
      text: "Brand Pie Chart",
    },
  },
};

export const data = {
  labels: ["Haldiram", "Hulas", "Jackpot", "ANNA", "Others"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2],
      backgroundColor: ["#3E7CF6", "#0FAF51", "#483d8b", "#00A0B0", "#FFAB00"],
      borderWidth: 0,
    },
  ],
};

const BrandAnalytics = ({ user }) => {
  const { Option } = Select;

  const { data: brandAnalytics } = useQuery({
    queryFn: () => getBrandAnalytics({ user_id: user.id }),
    queryKey: [GET_BRAND_ANALYTICS, user.id],
  });

  return (
    <div className="col-span-1">
      <span className="flex justify-between">
        <h2 className="text-xl">Brand Analytics</h2>
        <Select defaultValue="this_month" style={{ width: 120 }}>
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </span>

      <Doughnut data={data} options={options} />
    </div>
  );
};

export default BrandAnalytics;
