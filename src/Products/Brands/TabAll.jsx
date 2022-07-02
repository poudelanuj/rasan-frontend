import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Table, Select } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import {
  deleteProduct,
  getProductsFromBrand,
  publishProduct,
  unpublishProduct,
} from "../../context/CategoryContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { getDate, parseArray, parseSlug } from "../../utility";
import SimpleAlert from "../alerts/SimpleAlert";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import Loader from "../subComponents/Loader";

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
          {record.product_image.full_size && (
            <img
              alt={"text"}
              className="inline pr-4 h-[100%]"
              src={record.product_image.full_size}
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
    filters: [
      {
        text: "Includes VAT",
        value: true,
      },
      {
        text: "Doesn't Include VAT",
        value: false,
      },
    ],
    onFilter: (value, record) => record.includes_vat === value,
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
  const queryClient = useQueryClient();
  const [entriesPerPage, setEntriesPerPage] = useState(4);
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
  const { data, isLoading, isError, error } = useQuery(
    ["get-products-from-brand", slug],
    () => getProductsFromBrand({ slug }),
    {
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const { mutate: publishMutate } = useMutation(
    (slug) => publishProduct({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product published");
        queryClient.invalidateQueries(["get-products-from-brand", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: unpublishProductMutate } = useMutation(
    (slug) => unpublishProduct({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product unpublished");
        queryClient.invalidateQueries(["get-products-from-brand", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: deleteProductMutate } = useMutation(
    (slug) => deleteProduct({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.data.message || "Product deleted");
        queryClient.invalidateQueries(["get-products-from-brand", slug]);
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const handleBulkPublish = () => {
    selectedRowKeys.forEach(async (slug) => {
      publishMutate(slug);
    });
    setSelectedRowKeys([]);
  };
  const handleBulkUnpublish = () => {
    selectedRowKeys.forEach(async (slug) => {
      unpublishProductMutate(slug);
    });
    setSelectedRowKeys([]);
  };
  const handleBulkDelete = () => {
    selectedRowKeys.forEach((slug) => {
      deleteProductMutate(slug);
    });
    setSelectedRowKeys([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Brand?",
          text: "Are you sure you want to publish selected Brand?",
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
          title: "Unpublish Selected Brand?",
          text: "Are you sure you want to unpublish selected Brand?",
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
          title: "Delete Selected Brand?",
          text: "Are you sure you want to delete selected Brand?",
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
      {isLoading && <Loader loadingText={"Loading Products..."} />}
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
            <AddCategoryButton
              linkText="Add Products"
              linkTo={`/product-list/add?brand=${slug}`}
            />
          </div>
        </div>

        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={data?.data?.data?.products.results}
            rowKey="slug"
            rowClassName="cursor-pointer"
            footer={() => (
              <div className="absolute bottom-0 left-0 flex justify-start bg-white w-[100%]">
                <div className="mt-5">
                  <span className="text-sm text-gray-600">
                    Entries per page:{" "}
                  </span>
                  <Select
                    defaultValue={4}
                    style={{
                      width: 120,
                    }}
                    // loading
                    onChange={(value) => setEntriesPerPage(value)}
                  >
                    <Option value={4}>4</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                  </Select>
                </div>
              </div>
            )}
            pagination={{ pageSize: entriesPerPage }}
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
