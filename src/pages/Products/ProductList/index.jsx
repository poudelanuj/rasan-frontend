import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Space, Table, Tag, Select } from "antd";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import { isEmpty, uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import {
  GET_PAGINATED_PRODUCTS,
  GET_PAGINATED_BRANDS,
  GET_PAGINATED_CATEGORIES,
} from "../../../constants/queryKeys";
import { deleteProduct, getPaginatedProducts } from "../../../api/products";
import { getPaginatedBrands } from "../../../api/brands";
import { getPaginatedCategories } from "../../../api/categories";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import CustomPageHeader from "../../../shared/PageHeader";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import ButtonWPermission from "../../../shared/ButtonWPermission";

function ProductListScreen() {
  const { Option } = Select;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [products, setProducts] = useState([]);

  const [paginatedBrands, setPaginatedBrands] = useState([]);

  const [brandPage, setBrandPage] = useState(1);

  const [paginatedCategory, setPaginatedCategory] = useState([]);

  const [categoryPage, setCategoryPage] = useState(1);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState(""); // * For Delete

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const [sortObj, setSortObj] = useState({
    sortType: {
      name: false,
      published_at: false,
      is_published: false,
    },
    sort: [],
  });

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);

  const searchInput = useRef("");

  const brandSearch = useRef("");

  const categorySearch = useRef("");

  let timeout = 0;

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching,
  } = useQuery(
    [
      GET_PAGINATED_PRODUCTS,
      page.toString() + pageSize.toString(),
      sortObj.sort,
      selectedBrands,
      selectedCategory,
    ],
    () =>
      getPaginatedProducts(
        page,
        pageSize,
        sortObj.sort,
        searchInput.current,
        selectedBrands,
        selectedCategory
      )
  );

  useEffect(() => {
    if (!isRefetching && productsStatus === "success" && data) {
      setProducts([]);
      setProducts((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, isRefetching, productsStatus]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj, pageSize, selectedBrands, selectedCategory]);

  const {
    data: dataBrand,
    status: brandStatus,
    refetch: refetchBrands,
    isRefetching: isBrandRefetching,
  } = useQuery(
    [GET_PAGINATED_BRANDS, brandPage.toString(), brandSearch.current],
    () => getPaginatedBrands(brandPage, 100, brandSearch.current)
  );

  useEffect(() => {
    if (dataBrand && brandStatus === "success" && !isBrandRefetching) {
      setPaginatedBrands((prev) =>
        uniqBy([...prev, ...dataBrand.results], "slug")
      );
    }
  }, [dataBrand, isBrandRefetching, brandStatus]);

  useEffect(() => {
    refetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandPage]);

  const {
    data: dataCategory,
    status: statusCategory,
    refetch: refetchCategory,
    isRefetching: isCategoryRefetching,
  } = useQuery(
    [GET_PAGINATED_CATEGORIES, categoryPage.toString(), categorySearch.current],
    () => getPaginatedCategories(categoryPage, 100, categorySearch.current)
  );

  useEffect(() => {
    if (dataCategory && statusCategory === "success" && !isCategoryRefetching) {
      setPaginatedCategory((prev) =>
        uniqBy([...prev, ...dataCategory.results], "slug")
      );
    }
  }, [dataCategory, statusCategory, isCategoryRefetching]);

  useEffect(() => {
    refetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryPage]);

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

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const getSelectBrandsProps = (dataIndex) => ({
    filterDropdown: () => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Select
          dropdownClassName="!w-36"
          mode="multiple"
          placeholder={`Select ${dataIndex}`}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          onDeselect={(val) =>
            setSelectedBrands((prev) => prev.filter((brand) => brand !== val))
          }
          onPopupScroll={() =>
            dataBrand?.next && setBrandPage((prev) => prev + 1)
          }
          onSelect={(val) => setSelectedBrands((prev) => [...prev, val])}
        >
          {paginatedBrands?.map(({ slug, name }) => (
            <Option key={slug} value={slug}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
    ),
    filterIcon: (filtered) => (
      <CaretDownOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });

  const getSelectcategoriesProps = (dataIndex) => ({
    filterDropdown: () => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Select
          dropdownClassName="!w-36"
          mode="multiple"
          placeholder={`Select ${dataIndex}`}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          onDeselect={(val) =>
            setSelectedCategory((prev) =>
              prev.filter((category) => category !== val)
            )
          }
          onPopupScroll={() =>
            dataCategory?.next && setCategoryPage((prev) => prev + 1)
          }
          onSelect={(val) => setSelectedCategory((prev) => [...prev, val])}
        >
          {paginatedCategory?.map(({ slug, name }) => (
            <Option key={slug} value={slug}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
    ),
    filterIcon: (filtered) => (
      <CaretDownOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      width: "20%",
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
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "name"),
        };
      },
    },
    {
      title: "Brand",
      width: "15%",
      render: (_, { brand }) => {
        return (
          <div className="flex items-center capitalize">{parseSlug(brand)}</div>
        );
      },
      ...getSelectBrandsProps("brands"),
    },
    {
      title: "Category",
      width: "15%",
      render: (_, { category }) => {
        return (
          <div className="flex items-center capitalize">
            {category.map((item, index) => {
              return index !== category.length - 1 ? (
                <div key={item} className="mr-1">
                  {parseSlug(item)},
                </div>
              ) : (
                <div key={item}>{parseSlug(item)}</div>
              );
            })}
          </div>
        );
      },
      ...getSelectcategoriesProps("category"),
    },
    {
      title: "Status",
      dataIndex: "is_published",
      // render jsx
      render: (_, record) => {
        return (
          <Tag color={record.is_published ? "green" : "orange"}>
            {record.is_published ? "PUBLISHED" : "UNPUBLISHED"}
          </Tag>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "published_at"),
        };
      },
    },

    {
      title: "Published Date",
      dataIndex: "published_at",
      render: (_, { published_at }) => {
        return (
          <div className="text-center text-[14px] p-[2px_5px]">
            {published_at ? moment(published_at).format("ll") : "-"}
          </div>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "published_at"),
        };
      },
    },
    {
      title: "Actions",
      render: (_, { slug }) => {
        return (
          <Space>
            <ButtonWPermission
              codename="change_product"
              size="small"
              onClick={() => navigate(`${slug}/edit`)}
            >
              Edit
            </ButtonWPermission>
            <ButtonWPermission
              codename="delete_product"
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
      <CustomPageHeader title="Products" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-lg min-h-[70vh]">
        <div className="w-full flex sm:flex-row flex-col-reverse gap-2 sm:items-center items-start justify-between mb-3">
          <div className="py-[3px] px-3 min-w-[18rem] sm:w-[18rem] w-full border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
            <SearchOutlined style={{ color: "#D9D9D9" }} />
            <input
              className="focus:outline-none w-full ml-1 placeholder:text-[#D9D9D9]"
              placeholder={"Search product..."}
              type="text"
              onChange={(e) => {
                searchInput.current = e.target.value;
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(refetchProducts, 400);
              }}
            />
          </div>

          <AddCategoryButton
            codename="add_product"
            linkText="Add Products"
            linkTo={`add`}
          />
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
            scroll={{ x: !isEmpty(products) && 1000 }}
            showSorterTooltip={false}
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
