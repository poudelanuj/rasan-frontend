import { ResponsivePie } from "@nivo/pie";
import * as ReactDOMServer from "react-dom/server";

const PieChart = ({ data }) => {
  const ArcLabels = (d) => {
    return (
      <div>
        <p>{d.data.percentage}</p>
        <p>{d.data.label}</p>
        <p>{d.data.amount}</p>
      </div>
    );
  };

  return (
    <ResponsivePie
      activeOuterRadiusOffset={8}
      arcLinkLabel={(d) => {
        // eslint-disable-next-line no-unused-vars
        const node = ReactDOMServer.renderToString(ArcLabels(d));
        return `${d.data.value}`;
      }}
      arcLinkLabelsColor={{ theme: "grid.line.stroke" }}
      arcLinkLabelsDiagonalLength={32}
      arcLinkLabelsStraightLength={0}
      arcLinkLabelsThickness={2}
      cornerRadius={4}
      data={data}
      enableArcLabels={false}
      height={400}
      innerRadius={0.5}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 50,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "square",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
      margin={{ top: 40, bottom: 80, left: 80, right: 80 }}
      motionConfig="stiff"
      padAngle={1}
    />
  );
};

export default PieChart;
