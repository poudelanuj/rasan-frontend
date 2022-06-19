import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import { getProductSKUs } from "../../context/CategoryContext";
import { useQuery } from "react-query";

import { getDate, parseSlug } from "../../utility";
import AddProductSKU from "./AddProductSKU";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    render: (text, record) => {
      return (
        <div className="h-[80px]">
          {record.product_sku_image.full_size && (
            <img
              alt={"text"}
              className="inline pr-4 h-[100%]"
              src={record.product_sku_image.full_size}
            />
          )}
        </div>
      );
    },
  },
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Name in Nepali",
    dataIndex: "name_np",
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
    title: "Product",
    render: (text, record) => {
      return (
        <div className="flex items-center capitalize">
          {parseSlug(record.product)}
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
  // {
  //   title: "Published Date",
  //   render: (text, record) => {
  //     return (
  //       <div className="text-center text-[14px] p-[2px_5px] text-[#0E9E49]">
  //         {getDate(record.published_at)}
  //       </div>
  //     );
  //   },
  // },
  {
    title: "Status",
    // render jsx
    render: (text, record) => {
      return (
        <div
          className={`text-center rounded-[36px] text-[14px] p-[2px_14px] ${
            record.is_published
              ? "bg-[#E4FEEF] text-[#0E9E49]"
              : "bg-[#FFF8E1] text-[#FF8F00]"
          }`}
        >
          {record.is_published ? "Published" : "Unpublished"}
        </div>
      );
    },
  },
];

function TabAll() {
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[2];
  } catch (error) {
    categorySlug = null;
  }
  const { data, isLoading, isError, error } = useQuery("get-product-skus", () =>
    getProductSKUs()
  );
  if (!isLoading) {
    console.log(data);
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return (
    <>
      {categorySlug === "add" && <AddProductSKU />}
      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          {/* <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
  <SearchOutlined style={{color: "#D9D9D9"}} />
  <input type="text" placeholder="Search category..." className="w-full ml-1 placeholder:text-[#D9D9D9]" />
  </div> */}
          <div>
            <AddCategoryButton linkText="Add Product SKU" linkTo={`add`} />
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? "Loading..." : null}
          {isError ? error.message : null}
          <Table
            columns={columns}
            dataSource={data?.data?.data?.results}
            footer={() => (
              <div className="absolute bottom-0 left-0 flex justify-start bg-white w-[100%]">
                <div className="">
                  <span className="text-sm text-gray-600">
                    Entries per page:{" "}
                  </span>
                  <Select
                    defaultValue="lucy"
                    style={{
                      width: 120,
                    }}
                    loading
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                  </Select>
                </div>
              </div>
            )}
            pagination={{ pageSize: 4 }}
            rowSelection={rowSelection}
            onRow={(record) => {
              return {
                onDoubleClick: (_) => {
                  navigate("/product-sku/" + record.slug);
                }, // double click row
              };
            }}
          />
        </div>

        <div></div>
      </div>
    </>
  );
}

export default TabAll;
