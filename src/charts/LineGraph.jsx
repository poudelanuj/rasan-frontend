import { Line } from "@ant-design/plots";

const LineGraph = ({ data }) => {
  const config = {
    data,
    padding: "auto",
    xField: "Date",
    yField: "scales",
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
  };

  return <Line {...config} />;
};

export default LineGraph;
