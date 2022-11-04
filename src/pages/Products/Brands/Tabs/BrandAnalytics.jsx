import React from "react";
import { CustomCard } from "../../../../components/customCard";
import { Select, Table } from "antd";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    dataIndex: "product_image",
    render: (_, record) => {
      return <img src={record} alt="rasan" className="w-11" />;
    },
  },
  {
    title: "Product Name",
    dataIndex: "product_name",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
];

const data = [
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protien 200gm",
    quantity: 50,
    price: 10000,
  },
];

export const BrandAnalytics = () => {
  return (
    <CustomCard className="col-span-2">
      <div className="flex items-center justify-between">
        <p className="text-lg mb-0">Brand Analysis</p>
        <Select defaultValue="this_month" style={{ width: 120 }}>
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </div>
      <div className="bg-white border border-solid rounded-md border-gray-100 p-3.5 mt-7">
        <Table columns={columns} dataSource={data} />
      </div>
    </CustomCard>
  );
};
