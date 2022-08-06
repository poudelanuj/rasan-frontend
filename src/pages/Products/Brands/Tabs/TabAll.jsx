import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import { useMutation, useQuery } from "react-query";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { getDate, parseArray, parseSlug } from "../../../../utils";
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
    title: "Alternate Products",
    render: (text, record) => {
      return (
        <div className="capitalize">
          {record.alternate_products.length > 0 ? (
            parseArray(record.alternate_products)
          ) : (
            <div className="text-center">-</div>
          )}
        </div>
      );
    },
  },
  {
    title: "Supplementary Products",
    render: (text, record) => {
      return (
        <div className="capitalize">
          {record.supplementary_products.length > 0 ? (
            parseArray(record.supplementary_products)
          ) : (
            <div className="text-center">-</div>
          )}
        </div>
      );
    },
  },
  {
    title: "Includes VAT",
    dataIndex: "includes_vat",
    render: (text, record) => {
      return (
        <div
          className={`text-center rounded-[36px] text-[14px] p-[2px_14px] ${
            record.includes_vat
              ? "bg-[#E4FEEF] text-[#0E9E49]"
              : "bg-[#FFF8E1] text-[#FF8F00]"
          }`}
        >
          {record.includes_vat ? "Yes" : "No"}
        </div>
      );
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
  const pageSize = 20;
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const {
    data,
    status: productsStatus,
    refetch: refetchProducts,
    isRefetching: refetchingProducts,
  } = useQuery(
    [GET_PRODUCTS_FROM_BRAND, page.toString() + pageSize.toString()],
    () => getProductsFromBrand(slug, page, pageSize)
  );

  useEffect(() => {
    if (data)
      setPaginatedProducts((prev) =>
        uniqBy([...prev, ...data.products.results], "slug")
      );
  }, [data]);

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
            dataSource={
              paginatedProducts?.map((item, index) => ({
                ...item,
                index: index + 1,
                key: item.slug,
              })) || []
            }
            loading={productsStatus === "loading" || refetchingProducts}
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
