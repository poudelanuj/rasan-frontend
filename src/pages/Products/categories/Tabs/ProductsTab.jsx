import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Select, Tag } from "antd";
import { useMutation, useQuery } from "react-query";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { getDate, parseSlug } from "../../../../utils";
import { GET_CATEGORY_PRODUCTS } from "../../../../constants/queryKeys";
import { uniqBy } from "lodash";
import { getProductsFromCategory } from "../../../../api/categories";
import { ALERT_TYPE } from "../../../../constants";
import Alert from "../../../../shared/Alert";
import { bulkDelete, bulkPublish } from "../../../../api/products";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "index",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.index - b.index,
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
    title: "Brand",
    render: (text, record) => {
      return record.brand.length > 0 ? (
        <div className="capitalize">{parseSlug(record.brand)}</div>
      ) : (
        <div className="text-center">-</div>
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
        <div className="text-center">
          {record.published_at?.length > 0 ? (
            getDate(record.published_at)
          ) : (
            <div className="text-center">-</div>
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
  const pageSize = 10;
  const [products, setProducts] = useState([]);

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching,
  } = useQuery(
    [GET_CATEGORY_PRODUCTS, slug + page.toString() + pageSize.toString()],
    () => getProductsFromCategory({ categorySlug: slug, page, pageSize })
  );

  useEffect(() => {
    if (data) setProducts((prev) => uniqBy([...prev, ...data.results], "slug"));
  }, [data]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

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
        setProducts([]);
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
      setProducts([]);
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
            dataSource={products.map((item, index) => ({
              ...item,
              index: index + 1,
              key: item.id || item.slug,
            }))}
            loading={productsStatus === "loading" || isRefetching}
            pagination={{
              pageSize,
              total: data?.count,

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
