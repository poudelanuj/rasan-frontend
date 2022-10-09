import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select, Tag } from "antd";
import { useMutation, useQuery } from "react-query";

import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../../utils";
import { getCategory } from "../../../../api/categories";
import { GET_SINGLE_CATEGORY } from "../../../../constants/queryKeys";
import { uniqBy } from "lodash";
import Alert from "../../../../shared/Alert";
import { ALERT_TYPE } from "../../../../constants";
import { bulkDelete, bulkPublish } from "../../../../api/products/productSku";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "sn",
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
    title: "CP Per Piece (रु)",
    dataIndex: "cost_price_per_piece",
    sorter: (a, b) => a.cost_price_per_piece - b.cost_price_per_piece,
  },
  {
    title: "MRP Per Piece (रु)",
    dataIndex: "mrp_per_piece",
    sorter: (a, b) => a.mrp_per_piece - b.mrp_per_piece,
  },
  {
    title: "SP Per Piece (रु)",
    dataIndex: "price_per_piece",
    sorter: (a, b) => a.price_per_piece - b.price_per_piece,
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
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;
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
    queryKey: [GET_SINGLE_CATEGORY, slug],
    queryFn: () => getCategory(slug),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.product_skus && skuStatus === "success" && !isRefetching) {
      setProductSkus([]);
      setProductSkus((prev) =>
        uniqBy([...prev, ...data.product_skus.results], "slug")
      );
    }
  }, [data, skuStatus, isRefetching]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={productSkus.map((item) => ({
              ...item,
              key: item.id || item.slug,
            }))}
            loading={skuStatus === "loading" || isRefetching}
            pagination={{
              pageSize,
              total: data?.product_skus?.count,

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

        <div></div>
      </div>
    </>
  );
}

export default TabSKU;
