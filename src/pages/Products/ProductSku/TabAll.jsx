import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Space, Table, Tag } from "antd";
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
import ButtonWPermission from "../../../shared/ButtonWPermission";

function TabAll() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [productSkus, setProductSkus] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedSkuSlug, setSelectedSkuSlug] = useState(""); // * For Delete

  const [sortObj, setSortObj] = useState({
    sortType: {
      name: false,
      published_at: false,
      is_published: false,
    },
    sort: [],
  });

  const {
    data,
    status,
    isLoading,
    refetch: refetchProductSkus,
    isRefetching,
  } = useQuery(
    [
      GET_PAGINATED_PRODUCT_SKUS,
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
    () => getPaginatedProdctSkus(page, pageSize, sortObj.sort)
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setProductSkus([]);
      setProductSkus((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, isRefetching, status]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj.sort]);

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

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
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
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "name"),
        };
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "quantity"),
        };
      },
    },
    {
      title: "CP Per Piece",
      dataIndex: "cost_price_per_piece",
    },
    {
      title: "MRP Per Piece",
      dataIndex: "mrp_per_piece",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "mrp_per_piece"),
        };
      },
    },
    {
      title: "SP Per Piece",
      dataIndex: "price_per_piece",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "price_per_piece"),
        };
      },
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
      dataIndex: "is_published",
      render: (text, record) => {
        return (
          <Tag color={record.is_published ? "green" : "orange"}>
            {record.is_published ? "PUBLISHED" : "UNPUBLISHED"}
          </Tag>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "is_published"),
        };
      },
    },
    {
      title: "Actions",
      render: (_, { slug }) => {
        return (
          <Space>
            <ButtonWPermission
              codename="change_productsku"
              size="small"
              onClick={() => navigate(`${slug}/edit`)}
            >
              Edit
            </ButtonWPermission>
            <ButtonWPermission
              codename="delete_productsku"
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
            </ButtonWPermission>
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
            <AddCategoryButton
              codename="add_productsku"
              linkText="Add Product SKU"
              linkTo={`add`}
            />
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
            showSorterTooltip={false}
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
