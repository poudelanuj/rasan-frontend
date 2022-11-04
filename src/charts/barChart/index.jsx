import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const data = [
  { id: 0, quarter: 1, earnings: 13000 },
  { id: 1, quarter: 2, earnings: 16500 },
  { id: 2, quarter: 3, earnings: 14250 },
  { id: 3, quarter: 4, earnings: 19000 },
  { id: 4, quarter: 5, earnings: 19000 },
  { id: 5, quarter: 6, earnings: 19000 },
  { id: 6, quarter: 7, earnings: 19000 },
  { id: 7, quarter: 8, earnings: 19000 },
];

const axisBottom = {
  tickSize: 0,
  tickPadding: 15,
  tickRotation: 0,
  legendPosition: "middle",
  legendOffset: 32,
};

export const BarChart = ({ data = [], keys, index }) => {
  return (
    <ResponsiveBar
      data={data}
      margin={{ top: 60, right: 0, bottom: 60, left: 50 }}
      height={400}
      padding={0.85}
      borderRadius={10}
      colors="#00A0B0"
      keys={keys}
      indexBy={index}
      axisBottom={axisBottom}
      isInteractive={true}
      enableLabel={false}
      tooltip={({ id, value, color }) => (
        <div className="bg-white p-4 rounded-md border border-solid border-ctb shadow-ctp">
          <p style={{ color: color }}>This is the test tooltip!</p>
        </div>
      )}
    />
  );
};
