import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, Space, Table, Tag } from "antd";
import { uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import { GET_PAGINATED_PRODUCTS } from "../../../constants/queryKeys";
import { deleteProduct, getPaginatedProducts } from "../../../api/products";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import CustomPageHeader from "../../../shared/PageHeader";
import ConfirmDelete from "../../../shared/ConfirmDelete";

function ProductListScreen() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [products, setProducts] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState(""); // * For Delete

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_PRODUCTS, page.toString() + pageSize.toString()],
    () => getPaginatedProducts(page, pageSize)
  );

  useEffect(() => {
    if (!isRefetching && productsStatus === "success" && data)
      setProducts((prev) => uniqBy([...prev, ...data.results], "slug"));
  }, [data, isRefetching, productsStatus]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteProduct = useMutation((slug) => deleteProduct(slug), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Product Deleted");
      setConfirmDelete(false);
      setProducts([]);
      refetchProducts();
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
      render: (_, { name, product_image, slug }) => (
        <div
          className="flex items-center gap-3 cursor-pointer text-blue-500 hover:underline"
          onClick={() => {
            navigate("/product-list/" + slug);
          }}
        >
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
          <Tag color={record.is_published ? "green" : "orange"}>
            {record.is_published ? "PUBLISHED" : "UNPUBLISHED"}
          </Tag>
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
                handleDeleteProduct.status === "loading" &&
                selectedProductSlug === slug
              }
              size="small"
              type="danger"
              onClick={() => {
                setSelectedProductSlug(slug);
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
      <CustomPageHeader title="Products" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          <div>
            <AddCategoryButton linkText="Add Products" linkTo={`add`} />
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={products.map((item) => ({
              ...item,
              key: item.slug,
            }))}
            loading={productsStatus === "loading" || isRefetching}
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
        deleteMutation={() => handleDeleteProduct.mutate(selectedProductSlug)}
        isOpen={confirmDelete}
        status={handleDeleteProduct.status}
        title={`Delete Product #${parseSlug(selectedProductSlug)}`}
      />
    </>
  );
}

export default ProductListScreen;
