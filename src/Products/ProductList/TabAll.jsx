import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { Table } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import { useQuery } from "react-query";

import Loader from "../../shared/Loader";
import { GET_PAGINATED_PRODUCTS } from "../../constants/queryKeys";
import { getPaginatedProducts } from "../../api/products";
import { useEffect } from "react";
import { parseSlug } from "../../utils";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    render: (_, { name, product_image }) => (
      <div className="flex items-center gap-3">
        <img
          alt=""
          className="h-[40px] w-[40px] object-cover rounded"
          src={product_image?.thumbnail || "/rasan-default.png"}
        />
        <span>{name}</span>
      </div>
    ),
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
    title: "Published Date",
    render: (_, { published_at }) => {
      return (
        <div className="text-center text-[14px] p-[2px_5px]">
          {moment(published_at).format("ll")}
        </div>
      );
    },
  },
];

function TabAll() {
  const [nextPage, setNextPage] = useState(1); //* api
  const [products, setProducts] = useState([]);

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching,
  } = useQuery(GET_PAGINATED_PRODUCTS, () => getPaginatedProducts(nextPage));

  useEffect(() => {
    if (data) setProducts((prev) => [...prev, ...data.results]);
  }, [data]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage]);

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
      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          <div>
            <AddCategoryButton linkText="Add Products" linkTo={`add`} />
          </div>
        </div>

        <div className="flex-1">
          {(productsStatus === "loading" || isRefetching) && <Loader />}

          <Table
            columns={columns}
            dataSource={products.map((item) => ({
              ...item,
              key: item.id || item.slug,
            }))}
            pagination={{
              pageSize: 5,
              total: data?.count,

              onChange: (page, pageSize) => {
                if (page * pageSize > data?.results?.length) {
                  const next = parseInt(data?.next?.split("?page=")[1], 10);
                  const prev = parseInt(data?.previous?.split("?page=")[1], 10);

                  setNextPage(next || prev || nextPage);
                }
              },
            }}
            rowClassName="cursor-pointer"
            rowSelection={rowSelection}
            onRow={(record) => {
              return {
                onClick: (_) => {
                  navigate("/product-list/" + record.slug);
                },
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
