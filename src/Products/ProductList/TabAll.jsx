import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import { getProducts } from "../../context/CategoryContext";
import { useQuery } from "react-query";

import { getDate, parseSlug } from "../../utility";
import AddProductList from "./AddProductList";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    render: (text, record) => {
      return (
        <div className="h-[80px]">
          {record.product_image.full_size && (
            <img
              alt={"text"}
              className="inline pr-4 h-[100%]"
              src={record.product_image.full_size}
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
  //   {
  //     title: "Product Price",
  //     dataIndex: "price_per_piece",
  //     defaultSortOrder: "descend",
  //     // sorter: (a, b) => a.address.length - b.address.length,
  //   },
  //   {
  //     title: "Product Brand",
  //     dataIndex: "name",
  //   },
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
    title: "Category",
    render: (text, record) => {
      return (
        <div className="flex items-center capitalize">
          {record.category.map((item, index) => {
            if (index === 0) {
              return <div>{parseSlug(item)}</div>;
            } else {
              return <div>, {parseSlug(item)}</div>;
            }
          })}
        </div>
      );
    },
  },
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
  {
    title: "Includes VAT",
    render: (text, record) => {
      return (
        <div
          className={`text-center rounded-[36px] text-[14px] p-[2px_5px] ${
            record.includes_vat
              ? "bg-[#E4FEEF] text-[#0E9E49]"
              : "bg-[#FFF8E1] text-[#FF8F00]"
          }`}
        >
          {record.includes_vat ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    title: "Published Date",
    render: (text, record) => {
      return (
        <div
          className={`text-center text-[14px] p-[2px_5px] ${
            record.is_published ? "text-[#0E9E49]" : "text-[#FF8F00]"
          }`}
        >
          {getDate(record.published_at)}
        </div>
      );
    },
  },
];
// const data = [];

// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Rice ${i}`,
//     productid: "12345",
//     productPrice: "$10.00",
//     productBrand: "Preety",
//     productGroup: "Food",
//     profile_picture:
//       "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
//   });
// }

function TabAll() {
  // const { slug } = useParams();
  const { data, isLoading, isError, error } = useQuery("get-products", () =>
    getProducts()
  );
  const location = useLocation();
  let lastSlug;
  try {
    lastSlug = location.pathname.split("/")[2];
  } catch (error) {
    lastSlug = null;
  }
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
      {lastSlug === "add" && <AddProductList />}
      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          {/* <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
<SearchOutlined style={{color: "#D9D9D9"}} />
<input type="text" placeholder="Search category..." className="w-full ml-1 placeholder:text-[#D9D9D9]" />
</div> */}
          <div>
            <AddCategoryButton linkText="Add Products" linkTo={`add`} />
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
                  navigate("/category-list/" + record.key);
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
