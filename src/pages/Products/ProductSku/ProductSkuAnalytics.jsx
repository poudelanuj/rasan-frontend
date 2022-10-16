import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Divider, Select, Space } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

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

export const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Product SKU Bar Chart",
    },
  },
};

const barLabels = [..."123456789012"];

export const barData = {
  labels: barLabels,
  datasets: [
    {
      label: "Total Amount",
      data: barLabels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "#00A0B0",
      borderRadius: 16,
      inflateAmount: -20,
    },
  ],
};

export const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Inventory Line Chart",
    },
  },
};

const lineLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const lineData = {
  labels: lineLabels,
  datasets: [
    {
      fill: true,
      label: "Total Purchased",
      data: lineLabels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: "#1A63F4",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderWidth: 1,
    },
  ],
};

const ProductSkuAnalytics = () => {
  const { Option } = Select;

  return (
    <Space className="w-full" direction="vertical">
      <div>
        <span className="flex justify-between">
          <h2 className="text-xl">Product SKU Analytics</h2>
          <Select defaultValue="this_month" style={{ width: 120 }}>
            <Option value="today">Today</Option>
            <Option value="this_month">This Month</Option>
            <Option value="last_year">Last Year</Option>
          </Select>
        </span>

        <Bar data={barData} options={barOptions} />
      </div>

      <Divider />

      <div>
        <span className="flex justify-between">
          <h2 className="text-xl">Inventory</h2>
          <Select defaultValue="this_month" style={{ width: 120 }}>
            <Option value="today">Today</Option>
            <Option value="this_month">This Month</Option>
            <Option value="last_year">Last Year</Option>
          </Select>
        </span>

        <Line data={lineData} options={lineOptions} />
      </div>
    </Space>
  );
};

export default ProductSkuAnalytics;
