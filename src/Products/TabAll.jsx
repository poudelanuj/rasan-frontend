import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import AddCategoryButton from "./subComponents/AddCategoryButton";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    // dataIndex: 'key',
    render: (text, record) => {
      return (
        <div className="h-[80px]">
          {record.profile_picture && (
            <img
              alt={"text"}
              className="inline pr-4 h-[100%]"
              src={record.profile_picture}
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
    title: "Product ID",
    dataIndex: "productId",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "Product Price",
    dataIndex: "productPrice",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "Product Brand",
    dataIndex: "productBrand",
  },
  {
    title: "Product Group",
    dataIndex: "productGroup",
  },
];
const data = [];

for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Rice ${i}`,
    productid: "12345",
    productPrice: "$10.00",
    productBrand: "Preety",
    productGroup: "Food",
    profile_picture:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  });
}

function TabAll({ slug }) {
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
          <AddCategoryButton linkText="Add Products" linkTo={`add`} />
        </div>
      </div>

      <div className="flex-1">
        <Table
          columns={columns}
          dataSource={data}
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
                navigate("/category-list/" + slug + "/" + record.key);
              }, // double click row
            };
          }}
        />
      </div>

      <div></div>
    </div>
  );
}

export default TabAll;
