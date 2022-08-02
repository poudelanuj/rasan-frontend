import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddCategoryButton from "../../subComponents/AddCategoryButton";
import {
  deleteProductSKU,
  publishProductSKU,
  unpublishProductSKU,
} from "../../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
  parseArray,
  parseSlug,
} from "../../../../utils";
import SimpleAlert from "../../../../shared/Alert";
import { getCategory } from "../../../../api/categories";
import { GET_SINGLE_CATEGORY } from "../../../../constants/queryKeys";
import { uniqBy } from "lodash";

const { Option } = Select;

const columns = [
  {
    title: "S.N.",
    dataIndex: "sn",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.sn - b.sn,
  },
  {
    title: "Product Image",
    render: (text, record) => {
      return (
        <div className="h-[80px]">
          {record.product_sku_image.full_size && (
            <img
              alt={"text"}
              className="inline pr-4 h-[100%]"
              src={record.product_sku_image.full_size}
            />
          )}
        </div>
      );
    },
  },
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
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

function TabSKU({ slug, publishCategory }) {
  const queryClient = useQueryClient();
  // const { slug } = useParams();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [productSkus, setProductSkus] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    text: "",
    type: "",
    primaryButton: "",
    secondaryButton: "",
    image: "",
    action: "",
    actionOn: "",
    icon: "",
  });
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
  } = useQuery([GET_SINGLE_CATEGORY, slug], () => getCategory(slug));

  const navigate = useNavigate();

  useEffect(() => {
    if (data)
      setProductSkus((prev) =>
        uniqBy([...prev, ...data.product_skus.results], "slug")
      );
  }, [data]);

  useEffect(() => {
    refetchProductSkus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const { mutate: publishSKUMutate } = useMutation(
    (slug) => publishProductSKU({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product SKU published");
        queryClient.invalidateQueries(["get-category", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: unpublishProductSKUMutate } = useMutation(
    (slug) => unpublishProductSKU({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product SKU unpublished");
        queryClient.invalidateQueries(["get-category", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: deleteProductSKUMutate } = useMutation(
    (slug) => deleteProductSKU({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product SKU deleted");
        queryClient.invalidateQueries(["get-category", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const handleBulkPublish = () => {
    selectedRowKeys.forEach(async (slug) => {
      publishSKUMutate(slug);
    });
    setSelectedRowKeys([]);
  };
  const handleBulkUnpublish = () => {
    selectedRowKeys.forEach(async (slug) => {
      unpublishProductSKUMutate(slug);
    });
    setSelectedRowKeys([]);
  };
  const handleBulkDelete = () => {
    selectedRowKeys.forEach((slug) => {
      deleteProductSKUMutate(slug);
    });
    setSelectedRowKeys([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Product SKUs?",
          text: "Are you sure you want to publish selected Product SKUs?",
          type: "info",
          primaryButton: "Publish Selected",
          secondaryButton: "Cancel",
          image: "/publish-icon.svg",
          action: async () => handleBulkPublish(),
        });
        break;
      case "unpublish":
        setAlert({
          show: true,
          title: "Unpublish Selected Product SKUs?",
          text: "Are you sure you want to unpublish selected Product SKUs?",
          type: "warning",
          primaryButton: "Unpublish Selected",
          secondaryButton: "Cancel",
          image: "/unpublish-icon.svg",
          action: async () => handleBulkUnpublish(),
        });
        break;
      case "delete":
        setAlert({
          show: true,
          title: "Delete Selected Product SKUs?",
          text: "Are you sure you want to delete selected Product SKUs?",
          type: "danger",
          primaryButton: "Delete Selected",
          secondaryButton: "Cancel",
          image: "/delete-icon.svg",
          action: async () => handleBulkDelete(),
        });
        break;
      default:
        break;
    }
  };
  return (
    <>
      {alert.show && (
        <SimpleAlert
          action={alert.action}
          alert={alert}
          icon={alert.icon}
          image={alert.image}
          primaryButton={alert.primaryButton}
          secondaryButton={alert.secondaryButton}
          setAlert={setAlert}
          text={alert.text}
          title={alert.title}
          type={alert.type}
        />
      )}
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
                onChange={handleBulkAction}
              >
                <Option value="publish">Publish</Option>
                <Option value="unpublish">Unpublish</Option>
                <Option value="delete">Delete</Option>
              </Select>
            )}

            <Space>
              {publishCategory}

              <AddCategoryButton
                linkText="Add Product SKU"
                linkTo={`/product-sku/add?category=${slug}`}
              />
            </Space>
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
