import React from "react";
import { ResponsivePie } from "@nivo/pie";
import * as ReactDOMServer from "react-dom/server";

/* const pieData = [
  {
    id: "java",
    label: "java",
    value: 285,
    color: "hsl(316, 70%, 50%)",
  },
  {
    id: "rust",
    label: "rust",
    value: 101,
    color: "hsl(208, 70%, 50%)",
  },
  {
    id: "stylus",
    label: "stylus",
    value: 210,
    color: "hsl(302, 70%, 50%)",
  },
  {
    id: "javascript",
    label: "javascript",
    value: 381,
    color: "hsl(266, 70%, 50%)",
  },
  {
    id: "scala",
    label: "scala",
    value: 231,
    color: "hsl(304, 70%, 50%)",
  },
]; */

const ArcLabels = (d) => {
  return (
    <div>
      <p>{d.data.percentage}</p>
      <p>{d.data.label}</p>
      <p>{d.data.amount}</p>
    </div>
  );
};

export const PieChart = ({ data = [] }) => {
  return (
    <ResponsivePie
      arcLinkLabel={(d) => {
        // eslint-disable-next-line no-unused-vars
        const node = ReactDOMServer.renderToString(ArcLabels(d));
        return `${d.data.value}`;
      }}
      arcLinkLabelsColor={{ theme: "grid.line.stroke" }}
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
