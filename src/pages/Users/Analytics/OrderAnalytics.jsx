import { useQuery } from "react-query";
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
import { GET_ORDER_ANALYTICS } from "../../../constants/queryKeys";
import { getOrderAnalytics } from "../../../api/analytics";

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
      borderRadius: 10,
      inflateAmount: -13,
    },
  ],
};

const OrderAnalytics = ({ user }) => {
  const { Option } = Select;

  const { date: orderAnalytics } = useQuery({
    queryFn: () => getOrderAnalytics({ user_id: user.id }),
    queryKey: [GET_ORDER_ANALYTICS, user.id],
  });

  return (
    <div className="col-span-2">
      <span className="flex justify-between">
        <h2 className="text-xl">Order Analytics</h2>
        <Select defaultValue="this_month" style={{ width: 120 }}>
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </span>

      <Bar data={data} options={options} />
    </div>
  );
};

export default OrderAnalytics;
