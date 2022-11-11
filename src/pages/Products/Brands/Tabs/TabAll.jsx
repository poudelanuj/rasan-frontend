import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select, Tag } from "antd";
import { useMutation, useQuery } from "react-query";
import moment from "moment/moment";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { parseArray } from "../../../../utils";
import { ALERT_TYPE } from "../../../../constants";
import Alert from "../../../../shared/Alert";
import { GET_PRODUCTS_FROM_BRAND } from "../../../../constants/queryKeys";
import { bulkDelete, bulkPublish } from "../../../../api/products";
import { uniqBy } from "lodash";
import { getProductsFromBrand } from "../../../../api/brands";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "index",
  },

  {
    title: "Product Name",
    dataIndex: "name",
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
    title: "Category",
    render: (text, record) => {
      return (
        <div className="capitalize">
          {record.category.length > 0 ? (
            parseArray(record.category)
          ) : (
            <div className="text-center">-</div>
          )}
        </div>
      );
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
  {
    title: "Published At",
    render: (text, record) => {
      return (
        <div>
          {record.published_at?.length > 0 ? (
            moment(record.published_at).format("ll")
          ) : (
            <div>-</div>
          )}
        </div>
      );
    },
  },
];
function TabAll({ slug }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching: refetchingProducts,
  } = useQuery(
    [GET_PRODUCTS_FROM_BRAND, slug, page.toString() + pageSize.toString()],
    () => getProductsFromBrand(slug, page, pageSize)
  );

  useEffect(() => {
    if (data && productsStatus === "success" && !refetchingProducts) {
      setPaginatedProducts([]);
      setPaginatedProducts((prev) =>
        uniqBy([...prev, ...data.results], "slug")
      );
    }
  }, [data, productsStatus, refetchingProducts]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Products Updated");
        setOpenAlert(false);
        setSelectedRowKeys([]);
        setPaginatedProducts([]);
        refetchProducts();
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleBulkDelete = useMutation((slugs) => bulkDelete(slugs), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Products Deleted");
      setOpenAlert(false);
      setSelectedRowKeys([]);
      setPaginatedProducts([]);
      refetchProducts();
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
            dataSource={
              paginatedProducts?.map((item, index) => ({
                ...item,
                index: (page - 1) * pageSize + index + 1,
                key: item.slug,
              })) || []
            }
            loading={productsStatus === "loading" || refetchingProducts}
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
            scroll={{ x: 1000 }}
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
