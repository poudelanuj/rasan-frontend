import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Space, Table } from "antd";
import { useMutation, useQuery } from "react-query";
import AddCategoryButton from "../subComponents/AddCategoryButton";

import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import { uniqBy } from "lodash";
import { GET_PAGINATED_PRODUCT_SKUS } from "../../../constants/queryKeys";
import {
  deleteProductSku,
  getPaginatedProdctSkus,
} from "../../../api/products/productSku";
import ConfirmDelete from "../../../shared/ConfirmDelete";

function TabAll() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [productSkus, setProductSkus] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedSkuSlug, setSelectedSkuSlug] = useState(""); // * For Delete

  const {
    data,
    isLoading,
    refetch: refetchProductSkus,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_PRODUCT_SKUS, page.toString() + pageSize.toString()],
    () => getPaginatedProdctSkus(page, pageSize)
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data)
      setProductSkus((prev) => uniqBy([...prev, ...data.results], "slug"));
  }, [data]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteSku = useMutation((slug) => deleteProductSku(slug), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Product Deleted");
      setConfirmDelete(false);
      setProductSkus([]);
      refetchProductSkus();
      setPage(1);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      defaultSortOrder: "descend",
      render: (_, { name, product_sku_image, slug }) => (
        <div
          className="flex items-center gap-3 cursor-pointer text-blue-500 hover:underline"
          onClick={() => {
            navigate("/product-sku/" + slug);
          }}
        >
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
    {
      title: "Actions",
      render: (_, { slug }) => {
        return (
          <Space>
            <Button size="small" onClick={() => navigate(`${slug}/edit`)}>
              Edit
            </Button>
            <Button
              loading={
                handleDeleteSku.status === "loading" && selectedSkuSlug === slug
              }
              size="small"
              type="danger"
              onClick={() => {
                setSelectedSkuSlug(slug);
                setConfirmDelete(true);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

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
            <AddCategoryButton linkText="Add Product SKU" linkTo={`add`} />
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={
              productSkus?.map((item) => ({
                ...item,
                key: item.slug,
              })) || []
            }
            loading={isLoading || isRefetching}
            pagination={{
              pageSize,
              total: data?.count,

              onChange: (page, pageSize) => {
                setPage(page);
              },
            }}
            rowSelection={rowSelection}
          />
        </div>
      </div>

      <ConfirmDelete
        closeModal={() => setConfirmDelete(false)}
        deleteMutation={() => handleDeleteSku.mutate(selectedSkuSlug)}
        isOpen={confirmDelete}
        status={handleDeleteSku.status}
        title={`Delete Product Sku #${parseSlug(selectedSkuSlug)}`}
      />
    </>
  );
}

export default TabAll;
