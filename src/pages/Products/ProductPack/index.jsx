import { useEffect, useRef, useState } from "react";
import { Table, Button, Input, Upload, message, Modal, Tag, Tabs } from "antd";
import { csvParse } from "d3";
import {
  SearchOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { capitalize, isEmpty, uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  getProductPackCSV,
  postProductPackCSV,
} from "../../../api/products/productPack";
import { GET_PRODUCT_PACK_CSV } from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const JSONToCSV = (objArray) => {
  let csvrecord = Object.keys(objArray[0]).join(",") + "\n";
  objArray.forEach(function (jsonrecord) {
    csvrecord +=
      Object.values(jsonrecord)
        .map((record) =>
          Array.isArray(record) ? `"'${record.join("\n")}'"` : record
        )
        .join(",") + "\n";
  });

  return csvrecord;
};

const ProductPack = () => {
  const navigate = useNavigate();

  let timeout = 0;

  const searchProduct = useRef("");

  const searchProductSku = useRef("");

  const [selectedCSV, setSelectedCSV] = useState(null);

  const [productPack, setProductPack] = useState([]);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [isPublished, setIsPublished] = useState(true);

  const [sortObj, setSortObj] = useState({
    sortType: {
      number_of_items: false,
      price_per_piece: false,
      mrp_per_piece: false,
    },
    sort: [],
  });

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const { data, refetch, status, isRefetching } = useQuery({
    queryFn: () =>
      getProductPackCSV({
        page,
        pageSize,
        sort: sortObj.sort,
        shouldPaginate: true,
        product_name: searchProduct.current,
        product_sku_name: searchProductSku.current,
        isPublished,
      }),
    queryKey: [GET_PRODUCT_PACK_CSV, page, pageSize, sortObj.sort],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setProductPack([]);
      setProductPack((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortObj, isPublished]);

  const handlePostProductPack = useMutation(
    () => postProductPackCSV(selectedCSV),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetch();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const showConfirm = (file) => {
    Modal.confirm({
      title: "Are you sure to upload this file?",
      icon: <ExclamationCircleOutlined />,
      content: file,
      onOk() {
        handlePostProductPack.mutate();
      },
    });
  };

  const fileUploadOptions = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isCSV = file.type.startsWith("text/csv");
      if (!isCSV) {
        message.error(`${file.name} is not a csv file`);
        return isCSV || Upload.LIST_IGNORE;
      }

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const csv = e.target.result;

          setSelectedCSV(
            csvParse(csv).map((cs) => {
              delete cs["is_published"];
              return {
                ...cs,
                category_name: cs.category_name
                  .replace("'", "")
                  .replace("'", "")
                  .split("\n"),
              };
            })
          );
          showConfirm(file.name);
        };

        reader.readAsText(file);
      }

      return false;
    },
    onRemove: () => setSelectedCSV(null),
  };

  const getColumnSearchProps = (dataIndex, ref) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          style={{ marginBottom: 8, display: "block" }}
          onChange={(e) => {
            ref.current = e.target.value;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
              setPage(1);
              refetch();
            }, 400);
          }}
        />
      </div>
    ),
    filterIcon: <SearchOutlined />,
  });

  const columns = [
    {
      title: "S.N.",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "20%",
      render: (_, { product_slug, product_name }) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`/product-list/${product_slug}`)}
        >
          {product_name}
        </span>
      ),
      ...getColumnSearchProps("Product", searchProduct),
    },
    {
      title: "Product SKU Name",
      dataIndex: "product_sku_name",
      key: "product_sku_name",
      width: "20%",
      render: (_, { product_sku_slug, product_sku_name }) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`/product-sku/${product_sku_slug}`)}
        >
          {product_sku_name}
        </span>
      ),
      ...getColumnSearchProps("Product SKU", searchProductSku),
    },
    {
      title: "Brand",
      dataIndex: "brand_name",
      key: "brand_name",
      width: "12%",
      render: (_, { brand_slug }) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`/brands/${brand_slug}`)}
        >
          {capitalize(brand_slug.replaceAll("-", " "))}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      width: "12%",
      render: (_, { category_slug }) =>
        category_slug.map((category) => (
          <span
            key={category}
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/category-list/${category}`)}
          >
            {capitalize(category.replaceAll("-", " "))}
            {category_slug.length !== 1 && ", "}
          </span>
        )),
    },
    {
      title: "Number of items",
      dataIndex: "number_of_items",
      key: "number_of_items",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "number_of_items"),
        };
      },
    },
    {
      title: "Price per piece",
      dataIndex: "price_per_piece",
      key: "price_per_piece",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "price_per_piece"),
        };
      },
    },
    {
      title: "MRP per piece",
      dataIndex: "mrp_per_piece",
      key: "mrp_per_price",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "mrp_per_piece"),
        };
      },
    },
    {
      title: "Status",
      dataIndex: "is_published",
      render: (_, { is_published }) => {
        return (
          <Tag color={is_published ? "green" : "orange"}>
            {is_published ? "PUBLISHED" : "UNPUBLISHED"}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <CustomPageHeader title="Product Pack" isBasicHeader />
      <div className="bg-white p-6 rounded-lg">
        <div className="mb-4 flex gap-5 justify-between">
          <Upload {...fileUploadOptions}>
            <Button
              className="!flex items-center"
              loading={status === "loading"}
              type="primary"
            >
              <UploadOutlined /> Import CSV
            </Button>
          </Upload>

          <Button
            className="bg-cyan-500 text-white"
            type="default"
            onClick={async () => {
              const data = await getProductPackCSV({
                shouldPaginate: false,
              });
              const blob = new Blob(
                [
                  JSONToCSV(
                    data.map((product) => {
                      delete product["product_slug"];
                      delete product["product_sku_slug"];
                      delete product["brand_slug"];
                      delete product["category_slug"];
                      delete product["is_published"];
                      return product;
                    })
                  ),
                ],
                {
                  type: "text/csv;charset=utf-8;",
                }
              );
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", "export.csv");
              link.style.visibility = "hidden";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Export
          </Button>
        </div>

        <Tabs
          defaultActiveKey="published"
          onTabClick={(key) => {
            setPage(1);
            setIsPublished(key === "published");
          }}
        >
          <Tabs.TabPane key="published" tab="Published">
            <Table
              columns={columns}
              dataSource={
                !isEmpty(productPack) &&
                productPack.map((product, index) => ({
                  sn: (page - 1) * pageSize + index + 1,
                  ...product,
                }))
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
              scroll={{ x: !isEmpty(productPack) && 1000 }}
              showSorterTooltip={false}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="unpublished" tab="Unpublished">
            <Table
              columns={columns}
              dataSource={
                !isEmpty(productPack) &&
                productPack.map((product, index) => ({
                  sn: (page - 1) * pageSize + index + 1,
                  ...product,
                }))
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
              scroll={{ x: !isEmpty(productPack) && 1000 }}
              showSorterTooltip={false}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ProductPack;
