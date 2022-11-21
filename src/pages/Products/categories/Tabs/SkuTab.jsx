import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select, Tag } from "antd";
import { useMutation, useQuery } from "react-query";

import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../../utils";
import { getProductSkusFromCategory } from "../../../../api/categories";
import { GET_CATEGORY_PRODUCT_SKU } from "../../../../constants/queryKeys";
import { isEmpty, uniqBy } from "lodash";
import Alert from "../../../../shared/Alert";
import { ALERT_TYPE } from "../../../../constants";
import { bulkDelete, bulkPublish } from "../../../../api/products/productSku";
import { useAuth } from "../../../../AuthProvider";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "sn",
    key: "index",
  },
  {
    title: "Product Name",
    dataIndex: "name",
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
    title: "CP Per Piece (रु)",
    dataIndex: "cost_price_per_piece",
  },
  {
    title: "MRP Per Piece (रु)",
    dataIndex: "mrp_per_piece",
  },
  {
    title: "SP Per Piece (रु)",
    dataIndex: "price_per_piece",
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
    title: "Status",
    render: (text, record) => {
      return (
        <Tag color={record.is_published ? "green" : "orange"}>
          {record.is_published ? "PUBLISHED" : "UNPUBLISHED"}
        </Tag>
      );
    },
  },
];

function TabSKU({ slug }) {
  const { isMobileView } = useAuth();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [productSkus, setProductSkus] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const {
    data,
    status: skuStatus,
    refetch: refetchProductSkus,
    isRefetching,
  } = useQuery({
    queryKey: [
      GET_CATEGORY_PRODUCT_SKU,
      slug,
      pageSize.toString() + page.toString(),
    ],
    queryFn: () => getProductSkusFromCategory(slug, page, pageSize),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (data && skuStatus === "success" && !isRefetching) {
      setProductSkus([]);
      setProductSkus((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, skuStatus, isRefetching]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Products Updated");
        setOpenAlert(false);
        setSelectedRowKeys([]);
        setProductSkus([]);
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
      setProductSkus([]);
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

      <div className="flex flex-col bg-white min-h-[70vh]">
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
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={productSkus.map((item, index) => ({
              ...item,
              index: (page - 1) * pageSize + index + 1,
              key: item.id || item.slug,
            }))}
            loading={skuStatus === "loading" || isRefetching}
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
            rowClassName="cursor-pointer"
            rowKey="slug"
            rowSelection={rowSelection}
            scroll={{ x: isEmpty(productSkus) && !isMobileView ? null : 1000 }}
            onRow={(record) => {
              return {
                onClick: (_) => {
                  navigate("/product-sku/" + record.slug);
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

export default TabSKU;
