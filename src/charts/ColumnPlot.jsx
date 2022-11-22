import { Column } from "@ant-design/plots";

const ColumnPlot = ({ data }) => {
  const config = {
    data,
    xField: "type",
    yField: "sales",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
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
          value: `${datum.count} @ Rs. ${datum.sales}`,
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
  };
  return <Column {...config} />;
};

export default ColumnPlot;
