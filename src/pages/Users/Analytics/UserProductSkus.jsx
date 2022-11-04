import React from "react";
import { Select, Table } from "antd";
import { CustomCard } from "../../../components/customCard";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    dataIndex: "product_image",
    render: (_, record) => <img src={record} alt="rasan" className="w-11" />,
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
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
  {
    product_image: "",
    product_name: "Women Horlicks with extra protein 200gm",
    quantity: 50,
    price: 10000,
  },
];

const ProductSkusAnalytics = () => {
  return (
    <CustomCard className="col-span-2">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Product SKUs</h2>
        <Select defaultValue="this_month" style={{ width: 120 }}>
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={data} />
    </CustomCard>
  );
};

export default ProductSkusAnalytics;
