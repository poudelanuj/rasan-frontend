import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table } from "antd";
import { useQuery } from "react-query";
import { getProductSKUs } from "../../context/CategoryContext";
import AddCategoryButton from "../subComponents/AddCategoryButton";

import SimpleAlert from "../alerts/SimpleAlert";
import { parseSlug } from "../../utils";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    render: (_, { name, product_sku_image }) => (
      <div className="flex items-center gap-3">
        <img
          alt=""
          className="h-[40px] w-[40px] object-cover rounded"
          src={product_sku_image?.thumbnail || "/rasan-default.png"}
        />
        <span>{name}</span>
      </div>
    ),
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
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    text: "",
    type: "",
    primaryButton: "",
    secondaryButton: "",
    image: "",
    action: "",
    actionOn: "",
    icon: "",
  });

  const { data, isLoading, isError, error } = useQuery("get-product-skus", () =>
    getProductSKUs()
  );
  const entriesPerPage = 4;
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
      {alert.show && (
        <SimpleAlert
          action={alert.action}
          alert={alert}
          icon={alert.icon}
          image={alert.image}
          primaryButton={alert.primaryButton}
          secondaryButton={alert.secondaryButton}
          setAlert={setAlert}
          text={alert.text}
          title={alert.title}
          type={alert.type}
        />
      )}

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          <div>
            <AddCategoryButton linkText="Add Product SKU" linkTo={`add`} />
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? "Loading..." : null}
          {isError ? error.message : null}
          <Table
            columns={columns}
            dataSource={data?.data?.data?.results.map((item) => ({
              ...item,
              key: item.id || item.slug,
            }))}
            pagination={{ pageSize: entriesPerPage }}
            rowClassName="cursor-pointer"
            rowSelection={rowSelection}
            onRow={(record) => {
              return {
                onClick: (_) => {
                  navigate("/product-sku/" + record.slug);
                },
              };
            }}
          />
        </div>
      </div>
    </>
  );
}

export default TabAll;
