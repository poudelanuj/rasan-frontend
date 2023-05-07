import { Pie } from "@ant-design/plots";

const PieChart = ({ data }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "label",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
    legend: { layout: "horizontal", position: "bottom" },
  };
  return <Pie {...config} />;
};

export default PieChart;
