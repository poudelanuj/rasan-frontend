import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { Table, Select, Space } from "antd";

import AddCategoryButton from "../../subComponents/AddCategoryButton";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { parseArray, parseSlug } from "../../../../utils";
import { getProductSkusFromBrand } from "../../../../api/brands";
import { GET_PRODUCT_SKUS_FROM_BRAND } from "../../../../constants/queryKeys";
import { uniqBy } from "lodash";
import { ALERT_TYPE } from "../../../../constants";
import Alert from "../../../../shared/Alert";
import { bulkDelete, bulkPublish } from "../../../../api/products/productSku";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "index",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.sn - b.sn,
  },
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
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Cost Price / Piece (रु)",
    dataIndex: "cost_price_per_piece",
    sorter: (a, b) => a.cost_price_per_piece - b.cost_price_per_piece,
  },
  {
    title: "MRP / piece (रु)",
    dataIndex: "mrp_per_piece",
    sorter: (a, b) => a.mrp_per_piece - b.mrp_per_piece,
  },
  {
    title: "Price / piece (रु)",
    dataIndex: "price_per_piece",
    sorter: (a, b) => a.price_per_piece - b.price_per_piece,
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
      return <div className="capitalize">{parseSlug(record.brand)}</div>;
    },
  },
  {
    title: "Rasan Choices",
    render: (text, record) => {
      return (
        <div className="flex items-center capitalize">
          {parseArray(record.product_group)}
        </div>
      );
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
    filters: [
      {
        text: "Published",
        value: true,
      },
      {
        text: "Unpublished",
        value: false,
      },
    ],
    onFilter: (value, record) => record.is_published === value,
  },
];

function TabSKU({ slug, publishBrand }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [paginatedProductSkus, setPaginatedProductSkus] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    data,
    status: productSkuStatus,
    refetch: refetchProductSkus,
    isRefetching: refetchingProductSkus,
  } = useQuery(
    [GET_PRODUCT_SKUS_FROM_BRAND, page.toString() + pageSize.toString()],
    () => getProductSkusFromBrand(slug, page, pageSize)
  );

  useEffect(() => {
    if (data)
      setPaginatedProductSkus((prev) =>
        uniqBy([...prev, ...data.products.results], "slug")
      );
  }, [data]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const navigate = useNavigate();

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Products Updated");
        setOpenAlert(false);
        setSelectedRowKeys([]);
        setPaginatedProductSkus([]);
        refetchProductSkus();
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleBulkDelete = useMutation((slugs) => bulkDelete(slugs), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Products Deleted");
      setOpenAlert(false);
      setSelectedRowKeys([]);
      setPaginatedProductSkus([]);
      refetchProductSkus();
    },
    onError: (error) => openErrorNotification(error),
  });

  const renderAlert = () => {
    switch (alertType) {
      case "publish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: true,
                slugs: selectedRowKeys.map((slug) => slug),
              })
            }
            alertType={ALERT_TYPE.publish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to publish selected products?"
            title="Publish Selected Products"
          />
        );

      case "unpublish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: false,
                slugs: selectedRowKeys.map((slug) => slug),
              })
            }
            alertType={ALERT_TYPE.unpublish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to unpublish selected products?"
            title="Unpublish Selected Products"
          />
        );
      case "delete":
        return (
          <Alert
            action={() =>
              handleBulkDelete.mutate(selectedRowKeys.map((slug) => slug))
            }
            alertType={ALERT_TYPE.delete}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkDelete.status}
            text="Are you sure you want to delete selected products?"
            title="Delete Selected Products"
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      {openAlert && renderAlert()}

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
        <div className="flex justify-end mb-3">
          <div className="flex">
            {selectedRowKeys.length > 0 && (
              <Select
                style={{
                  width: 120,
                  marginRight: "1rem",
                }}
                value={"Bulk Actions"}
                onSelect={(value) => {
                  setOpenAlert(true);
                  setAlertType(value);
                }}
              >
                <Option value={ALERT_TYPE.publish}>Publish</Option>
                <Option value={ALERT_TYPE.unpublish}>Unpublish</Option>
                <Option value={ALERT_TYPE.delete}>Delete</Option>
              </Select>
            )}
            <Space>
              {publishBrand}
              <AddCategoryButton
                linkText="Add Product SKU"
                linkTo={`/product-sku/add?brand=${slug}`}
              />
            </Space>
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={
              paginatedProductSkus?.map((item, index) => ({
                ...item,
                index: index + 1,
                key: item.slug,
              })) || []
            }
            loading={productSkuStatus === "loading" || refetchingProductSkus}
            pagination={{
              pageSize,
              total: data?.products?.count,

              onChange: (page, pageSize) => {
                setPage(page);
              },
            }}
            rowClassName="cursor-pointer"
            rowKey="slug"
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

export default TabSKU;
