import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import {
  getCategory,
  getSKUsFromCategory,
} from "../../context/CategoryContext";
import { useQuery } from "react-query";

import { parseSlug } from "../../utility";

const { Option } = Select;

const columns = [
  {
    title: "S.No.",
    dataIndex: "sn",
  },
  {
    title: "Product Image",
    // dataIndex: 'key',
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
    title: "Slug",
    dataIndex: "slug",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Cost Price / Piece (रु)",
    dataIndex: "cost_price_per_piece",
  },
  {
    title: "MRP / piece (रु)",
    dataIndex: "mrp_per_piece",
  },
  {
    title: "Price / piece (रु)",
    dataIndex: "price_per_piece",
  },
  {
    title: "Product Group",
    dataIndex: "product_group",
  },
  {
    title: "Category",
    render: (text, record) => {
      return (
        <div className="capitalize">
          {record.category.map((category, index) => {
            return parseSlug(category);
          })}
        </div>
      );
    },
  },
  {
    title: "Brand",
    render: (text, record) => {
      return <div className="capitalize">{parseSlug(record.brand)}</div>;
    },
  },
  {
    title: "Loyalty Policy",
    render: (text, record) => {
      if (record.loyalty_policy) {
        return <div className="capitalize">{record.loyalty_policy}</div>;
      } else {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    title: "Status",
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

function TabSKU({ slug }) {
  // const { slug } = useParams();
  const [entriesPerPage, setEntriesPerPage] = useState(4);
  const { data, isLoading, isError, error } = useQuery(
    ["get-category", slug],
    () => getCategory({ slug })
  );

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
    <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
      <div className="flex justify-end mb-3">
        {/* <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
<SearchOutlined style={{color: "#D9D9D9"}} />
<input type="text" placeholder="Search category..." className="w-full ml-1 placeholder:text-[#D9D9D9]" />
</div> */}
        <div>
          <AddCategoryButton
            linkText="Add Product SKU"
            linkTo={`/product-sku/add`}
          />
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? "Loading..." : null}
        {isError ? error.message : null}
        <Table
          columns={columns}
          dataSource={data?.data?.data?.product_skus.results}
          footer={() => (
            <div className="absolute bottom-0 left-0 flex justify-start bg-white w-[100%]">
              <div className="">
                <span className="text-sm text-gray-600">
                  Entries per page:{" "}
                </span>
                <Select
                  defaultValue={4}
                  style={{
                    width: 120,
                  }}
                  // loading
                  onChange={(value) => setEntriesPerPage(value)}
                >
                  <Option value={4}>4</Option>
                  <Option value={10}>10</Option>
                  <Option value={15}>15</Option>
                  <Option value={20}>20</Option>
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                </Select>
              </div>
            </div>
          )}
          pagination={{ pageSize: entriesPerPage }}
          rowSelection={rowSelection}
          onRow={(record) => {
            return {
              onClick: (_) => {
                navigate("/product-sku/" + record.slug);
              },
              onMouseEnter: () => {
                document.body.style.cursor = "pointer";
              },
              onMouseLeave: () => {
                document.body.style.cursor = "default";
              },
            };
          }}
        />
      </div>

      <div></div>
    </div>
  );
}

export default TabSKU;
