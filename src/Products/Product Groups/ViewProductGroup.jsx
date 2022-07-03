import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getProductGroup,
  getProductSKUs,
  updateProductSKU,
} from "../../context/CategoryContext";
import { getDate, parseArray } from "../../utility";
import SimpleAlert from "../alerts/SimpleAlert";
import { noImageImage } from "../constants";
import EditProductGroup from "./EditProductGroup";
import { Select, Table } from "antd";
import Loader from "../subComponents/Loader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
const { Option } = Select;

function ViewProductGroup() {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };
  const [allProductSKUs, setAllProductSKUs] = useState([]);
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
  const [selectedProductSku, setSelectedProductSku] = useState(null);
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
      setProductGroup(newData);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });
  const { data: productSKUData } = useQuery(
    "get-product-sku",
    () => getProductSKUs(),
    {
      onSuccess: (data) => {
        setAllProductSKUs(data.data.data.results);
      },
    }
  );
  const { mutate: productSKUGroupUpdate } = useMutation(updateProductSKU, {
    onSuccess: (data) => {
      openSuccessNotification(`Product SKU updated in ${productGroup.name}`);
      queryClient.invalidateQueries(["get-product-group", slug]);
      queryClient.invalidateQueries("get-product-sku");
      setSelectedProductSku(null);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const handleDeleteProductSKUFromGroup = (value) => {
    let productGroups = allProductSKUs.find(
      (productSKU) => productSKU.slug === value
    ).product_group;
    productGroups.map((productGroup, index) => {
      if (productGroup === slug) {
        productGroups.splice(index, 1);
        console.log(productGroup, "matched");
      }
    });
    productSKUGroupUpdate({
      slug: value,
      form_data: { product_group: productGroups },
    });
  };

  const addProductSKUToGroup = (value) => {
    setSelectedProductSku(value);
    let productGroups = allProductSKUs.find(
      (productSKU) => productSKU.slug === value
    ).product_group;
    productGroups.push(slug);
    productSKUGroupUpdate({
      slug: value,
      form_data: { product_group: productGroups },
    });
  };

  const columns = [
    {
      title: "S.N.",
      dataIndex: "sn",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.sn - b.sn,
    },
    {
      title: "Product Name",
      render: (text, record) => {
        return (
          <Link
            to={"/product-sku/" + record.slug}
            className="block text-black h-[50px]"
          >
            {record.product_sku_image.full_size && (
              <>
                <img
                  alt={"text"}
                  className="inline pr-4 h-[100%]"
                  src={record.product_sku_image.full_size}
                />
                {record.name}
              </>
            )}
          </Link>
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
    },
    {
      title: "Action",
      render: (text, record) => {
        return (
          <div className="flex items-center">
            <button
              type="button"
              className="text-red-500 text-xl p-4 flex items-center justify-center"
              onClick={() => {
                return setAlert({
                  show: true,
                  title: "Delete Selected Product SKU from product group?",
                  text: "Product SKU would be deleted from product group only!",
                  type: "danger",
                  primaryButton: "Delete",
                  secondaryButton: "Cancel",
                  image: "/delete-icon.svg",
                  action: async () =>
                    handleDeleteProductSKUFromGroup(record.slug),
                });
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
        );
      },
    },
  ];
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
                      <p className="text-[#596579] text-[0.8rem] mb-0">S.N.</p>
                      <p className="text-[#596579] font-bold mb-0">
                        {productGroup.sn}
                      </p>
                    </div>

                    <div className="grid grid-cols-[10rem_10rem] gap-x-5 bg-[#f5f5f5] rounded-2xl py-2 px-4 mt-5">
                      <p className="text-[#596579] text-[0.8rem] mb-0">
                        Published At
                      </p>
                      <p className="text-[#596579] font-bold mb-0">
                        {productGroup.published_at
                          ? getDate(productGroup.published_at)
                          : "-"}
                      </p>
                    </div>

                    <div className="grid grid-cols-[10rem_10rem] gap-x-5 bg-[#f5f5f5] rounded-2xl py-2 px-4 mt-5">
                      <p className="text-[#596579] text-[0.8rem] mb-0">
                        Featured
                      </p>
                      <p className="text-[#596579] font-bold mb-0">
                        {productGroup.is_featured ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1"></div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-[#374253] my-3 mt-5">
                    Product SKU List
                  </h3>
                </div>
                <div className="flex-1">
                  <Table
                    columns={columns}
                    dataSource={productGroup?.product_skus?.results}
                    pagination={false}
                    rowClassName="h-[3rem]"
                    className="w-[75%]"
                  />
                </div>
                <div>
                  <form>
                    <Select
                      showSearch
                      style={{
                        width: 400,
                        marginTop: "1rem",
                      }}
                      value={selectedProductSku}
                      placeholder={`Add Product SKU to ${productGroup.name}`}
                      onChange={(value) => addProductSKUToGroup(value)}
                    >
                      {allProductSKUs
                        ?.filter(
                          (productSKU) =>
                            !productSKU.product_group.includes(slug)
                        )
                        .map((productSKU) => (
                          <Option value={productSKU.slug} key={productSKU.slug}>
                            {productSKU.name}
                          </Option>
                        ))}
                    </Select>
                  </form>
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
