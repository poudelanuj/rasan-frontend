import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Tag } from "antd";

import { parseSlug } from "../../utility";

const columns = [
  {
    title: "S.No",
    dataIndex: "index",
    defaultSortOrder: "ascend",
    render: (text) => <>#{text}</>,
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "CP Per Piece",
    dataIndex: "cost_price_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "MRP Per Piece",
    dataIndex: "mrp_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "SP Per Piece",
    dataIndex: "price_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "Category",
    render: (text, record) => {
      return (
        <div className="flex items-center capitalize">
          {record.category.map((cat, index) => {
            return parseSlug(cat);
          })}
        </div>
      );
    },
  },
  {
    title: "Brand",
    render: (text, record) => {
      return (
        <div className="flex items-center capitalize">
          {parseSlug(record.brand)}
        </div>
      );
    },
  },
  {
    title: "Status",
    render: (text, record) => {
      return (
        <Tag color={record.is_published ? "green" : "orange"}>
          {record.is_published ? "Published" : "Unpublished"}
        </Tag>
      );
    },
  },
];

function ProductSkuList({ productSkus }) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl text-[#374253]">Product SKU List</h3>
      </div>
      <div className="flex flex-col bg-white ">
        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={productSkus?.map((item, index) => ({
              ...item,
              key: item.id || item.sn,
              index: index + 1,
            }))}
            rowClassName="cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}

export default ProductSkuList;
