import CustomPageHeader from "../../../shared/PageHeader";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Space, Table, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

function ProductSkuScreen() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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

  const searchInput = useRef("");

  let timeout = 0;

  const {
    data,
    status,
    refetch: refetchProductSkus,
    isRefetching,
  } = useQuery(
    [
      GET_PAGINATED_PRODUCT_SKUS,
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
    () =>
      getPaginatedProdctSkus(page, pageSize, sortObj.sort, searchInput.current)
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRefetching && status === "success" && data) {
      setProductSkus([]);
      setProductSkus((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, isRefetching, status]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj.sort, pageSize]);

  /* console.log(
    productSkus.map(({ product_packs }) => product_packs.map(({ id }) => id))
  );*/

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          placeholder={`Search ${dataIndex}`}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          onChange={(e) => {
            searchInput.current = e.target.value;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(refetchProductSkus, 400);
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });

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
      width: "15%",
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
      ...getColumnSearchProps("product"),
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
      width: "10%",
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
      width: "10%",
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
      width: "10%",
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
      <CustomPageHeader title="Product SKU" isBasicHeader />
      <>
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
          <div className="flex items-center justify-between mb-3">
            <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
              <SearchOutlined style={{ color: "#D9D9D9" }} />
              <input
                className="focus:outline-none w-full ml-1 placeholder:text-[#D9D9D9]"
                placeholder={"Search product..."}
                type="text"
                onChange={(e) => {
                  searchInput.current = e.target.value;
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(refetchProductSkus, 400);
                }}
              />
            </div>

            <AddCategoryButton
              codename="add_productsku"
              linkText="Add Product SKU"
              linkTo={`add`}
            />
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
              loading={status === "loading" || isRefetching}
              pagination={{
                showSizeChanger: true,
                pageSize,
                total: data?.count,
                current: page,

                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
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
    </>
  );
}

export default ProductSkuScreen;
