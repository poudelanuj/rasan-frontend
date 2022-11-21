import React from "react";
import { ResponsiveLine } from "@nivo/line";

const lineData = [
  {
    id: "Japan",
    color: "#1A63F4",
    data: [
      {
        x: "plane",
        y: 8,
      },
      {
        x: "helicopter",
        y: 62,
      },
      {
        x: "boat",
        y: 298,
      },
      {
        x: "train",
        y: 157,
      },
      {
        x: "subway",
        y: 34,
      },
      {
        x: "bus",
        y: 177,
      },
      {
        x: "car",
        y: 188,
      },
      {
        x: "moto",
        y: 237,
      },
      {
        x: "bicycle",
        y: 268,
      },
      {
        x: "horse",
        y: 219,
      },
      {
        x: "skateboard",
        y: 37,
      },
      {
        x: "others",
        y: 68,
      },
    ],
  },
];

export const LineChart = ({ data = [] }) => {
  return (
    <ResponsiveLine
      colors={(d) => d.color}
      data={lineData}
      defs={[
        {
          id: "gradientA",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "rgb(26,29,244)" },
            { offset: 100, color: "#ACC8FF" },
          ],
        },
      ]}
      enableArea={true}
      enableGridX={false}
      enablePoints={false}
      enableSlices="x"
      fill={[{ match: "*", id: "gradientA" }]}
      height={400}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      yScale={{
        type: "linear",
      }}
    />
  );
};
