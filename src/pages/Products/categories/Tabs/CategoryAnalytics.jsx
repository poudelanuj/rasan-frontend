import React, { useState } from "react";
import { CustomCard } from "../../../../components/customCard";
import { Table } from "antd";
import { AnalysisTimeSelector } from "../../../../components/analysisTimeSelector";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getCategoryAnalysis } from "../../../../context/UserContext";
import time from "../../../../svgs/Time";

const columns = [
  {
    title: "Product Image",
    dataIndex: "product_image",
    render: (_, record) => {
      return <img src={record} className="w-11" alt="rasan" />;
    },
  },
  {
    title: "Category Name",
    dataIndex: "category_name",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
    render: (_, record) => `Rs. ${record.price}`,
  },
];

const data = [
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    category_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
];

export const CategoryAnalytics = () => {
  const { user_id } = useParams();
  const [timeStamp, setTimeStamp] = useState("today");

  const {
    data: analytics,
    isLoading,
    isSuccess,
  } = useQuery(["analytics", user_id], async () =>
    getCategoryAnalysis(timeStamp, user_id, undefined)
  );

  console.log("this is the analytics", analytics);

  return (
    <CustomCard className="col-span-2">
      <div className="flex items-center justify-between">
        <p className="text-xl mb-0 text-text">Category Analysis</p>
        <AnalysisTimeSelector />
      </div>
      <div className="bg-white rounded-md border border-solid border-gray-100 p-3.5 mt-7">
        <Table dataSource={data} columns={columns} />
      </div>
    </CustomCard>
  );
};
