import { Bar } from "@ant-design/plots";

const BarPlot = ({ data }) => {
  const config = {
    data,
    xField: "sales",
    yField: "type",
    // label: {
    //   position: "middle",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.6,
    //   },
    // },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    tooltip: {
      fields: ["sales", "count"],
      formatter: (datum) => {
        return {
          name: "Total Purchased",
          value: `${datum.count} unit/s @ Rs. ${datum.sales}`,
        };
      },
    },
    meta: {
      type: {
        alias: "Name",
      },
      sales: {
        alias: "Total Amount",
      },
      count: {
        alias: "Count",
      },
    },
    scrollbar: {
      type: "vertical",
    },
  };
  return <Bar {...config} />;
};

export default BarPlot;
