import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deleteProductSKU,
  getProductGroup,
  publishProductSKU,
  unpublishProductSKU,
} from "../../context/CategoryContext";
import { getDate, parseArray, parseSlug } from "../../utility";
import SimpleAlert from "../alerts/SimpleAlert";
import { noImageImage } from "../constants";
import EditProductGroup from "./EditProductGroup";
import { message, Select, Table } from "antd";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import Loader from "../subComponents/Loader";
import ClearSelection from "../subComponents/ClearSelection";
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
        <div className="flex items-center capitalize">
          {parseArray(record.category)}
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
      return (
        <div className="flex items-center capitalize">
          {parseSlug(record.brand)}
        </div>
      );
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
    dataIndex: "is_published",
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
function ViewProductGroup() {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    // select by slug
    onChange: onSelectChange,
    selectedRowKeys,
  };
  const navigate = useNavigate();
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
  const { slug } = useParams();
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[3];
  } catch (error) {
    categorySlug = null;
  }
  const [productGroup, setProductGroup] = useState({
    sn: "",
    name: "",
    slug: "",
    name_np: "",
    is_published: "",
    is_featured: "",
    product_group_image: "",
  });
  const {
    data: productGroupData,
    isLoading: getProductGroupIsLoading,
    isError: getProductGroupIsError,
    error: getProductGroupError,
  } = useQuery(["get-product-group", slug], () => getProductGroup({ slug }), {
    onSuccess: (data) => {
      let newData = data.data.data;
      newData.product_skus.results.map((productSku, index) => {
        productSku["key"] = productSku.slug;
      });
      // setProductGroup(data.data.data);
      setProductGroup(newData);
    },
  });

  const { mutate: publishSKUMutate } = useMutation(
    (slug) => publishProductSKU({ slug }),
    {
      onSuccess: (data) => {
        message.success(data.data.message || "Product SKU published");
        queryClient.invalidateQueries(["get-product-group", slug]);
      },
    }
  );
  const { mutate: unpublishProductSKUMutate } = useMutation(
    (slug) => unpublishProductSKU({ slug }),
    {
      onSuccess: (data) => {
        message.success(data.data.message || "Product SKU unpublished");
        queryClient.invalidateQueries(["get-product-group", slug]);
      },
    }
  );
  const { mutate: deleteProductSKUMutate } = useMutation(
    (slug) => deleteProductSKU({ slug }),
    {
      onSuccess: (data) => {
        message.success(data.data.message || "Product SKU deleted");
        queryClient.invalidateQueries(["get-product-group", slug]);
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
      {categorySlug === "edit" && (
        <EditProductGroup alert={alert} setAlert={setAlert} />
      )}
      {getProductGroupIsLoading && (
        <Loader loadingText={"Loading Rasan Choice..."} />
      )}
      {productGroupData && (
        <>
          <div className="text-3xl bg-white p-5 mb-7">{productGroup.name}</div>
          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[150px] h-[150px]">
                  <img
                    src={
                      productGroup.product_group_image.full_size ||
                      productGroup.product_group_image.medium_square_crop ||
                      productGroup.product_group_image.small_square_crop ||
                      productGroup.product_group_image.thumbnail ||
                      noImageImage
                    }
                    alt="product"
                    className="w-[100%] h-[100%] object-cover"
                  />
                </div>
                <div className="ml-5 items-center">
                  <h1 className="text-[#000000] font-bold text-[1.4rem]">
                    {productGroup.name}
                  </h1>
                  <p className="text-[#596579] font-bold mt-5">
                    {productGroup.name_np}
                  </p>
                </div>
                <div className="absolute top-0 right-0">
                  <Link
                    to={"edit"}
                    className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
                  >
                    <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                    Details
                  </Link>
                </div>
              </div>
              <div className="mt-[1rem]">
                <div className="flex justify-start items-center">
                  <h3 className="text-xl text-[#374253]">
                    Rasan Choice Details
                  </h3>
                  {productGroup.is_published ? (
                    <p className="ml-[6rem] rounded-full bg-[#E4FEEF] text-[#0E9E49] px-[1rem] py-[2px]">
                      Published
                    </p>
                  ) : (
                    <p className="ml-[6rem] rounded-full bg-[#FFF8E1] text-[#FF8F00] px-[1rem] py-[2px]">
                      Unpublished
                    </p>
                  )}
                </div>
                <div className="mt-[0.5rem] flex">
                  <div className="flex flex-col flex-1 items-start">
                    <div className="grid grid-cols-[10rem_10rem] gap-x-5 bg-[#f5f5f5] rounded-2xl py-2 px-4 mt-5">
                      <p className="text-[#596579] text-[0.8rem]">S.N.</p>
                      <p className="text-[#596579] font-bold">
                        {productGroup.sn}
                      </p>
                    </div>

                    <div className="grid grid-cols-[10rem_10rem] gap-x-5 bg-[#f5f5f5] rounded-2xl py-2 px-4 mt-5">
                      <p className="text-[#596579] text-[0.8rem]">
                        Published At
                      </p>
                      <p className="text-[#596579] font-bold">
                        {productGroup.published_at
                          ? getDate(productGroup.published_at)
                          : "-"}
                      </p>
                    </div>

                    <div className="grid grid-cols-[10rem_10rem] gap-x-5 bg-[#f5f5f5] rounded-2xl py-2 px-4 mt-5">
                      <p className="text-[#596579] text-[0.8rem]">Featured</p>
                      <p className="text-[#596579] font-bold">
                        {productGroup.is_featured ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1"></div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-[#374253] my-3 mt-5">
                    Product SKU details
                  </h3>
                  <div className="flex justify-end">
                    <ClearSelection
                      selectedCategories={selectedRowKeys}
                      setSelectedCategories={setSelectedRowKeys}
                    />
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
                      linkText={"Add Product SKU"}
                      linkTo={
                        "/product-sku/add?product-group=" + productGroup.slug
                      }
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Table
                    columns={columns}
                    dataSource={productGroup?.product_skus?.results}
                    pagination={false}
                    rowClassName="cursor-pointer"
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
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProductGroup;
