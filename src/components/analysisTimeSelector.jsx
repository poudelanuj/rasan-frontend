import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const timeList = [
  {
    key: "today",
    value: "Today",
  },
  {
    value: "This Month",
    key: "this_month",
  },
  {
    value: "Last Year",
    key: "last_year",
  },
];

export const AnalysisTimeSelector = ({ onChange }) => {
  return (
    <Select
      defaultValue="this_month"
      onChange={onChange}
      style={{ width: 120 }}
    >
      <>
        {timeList.map((x) => (
          <Option key={x.key} value={x.key}>
            {x.value}
          </Option>
        ))}
      </>
    </Select>
  );
};
