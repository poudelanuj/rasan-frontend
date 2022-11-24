import { Pie } from "@ant-design/plots";

const PieChart = ({ data, type }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "outer",
      offset: "75%",
      content: "{value}\n({percentage})",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: type,
      },
    },
  };
  return <Pie {...config} />;
};

export default PieChart;
