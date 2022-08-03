import { DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Select, Space, Table } from "antd";
import {
  getProductGroup,
  updateProductSKU,
} from "../../../context/CategoryContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { getAllProductSkus } from "../../../api/products/productSku";
import { GET_ALL_PRODUCT_SKUS } from "../../../constants/queryKeys";
import { getDate, parseArray } from "../../../utils";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import CustomPageHeader from "../../../shared/PageHeader";
import { publishProductGroup } from "../../../api/products/productGroups";
import Loader from "../../../shared/Loader";
import EditProductGroup from "./EditProductGroup";

const { Option } = Select;

function ViewProductGroup() {
  const queryClient = useQueryClient();

  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const { slug } = useParams();

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
    status: productGroupStatus,
    refetch: refetchProductGroup,
  } = useQuery(["get-product-group", slug], () => getProductGroup({ slug }), {
    onSuccess: (data) => {
      let newData = data.data.data;
      newData.product_skus.results.forEach((productSku) => {
        productSku["key"] = productSku.slug;
      });
      setProductGroup(newData);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

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

  const addProductSKUToGroup = (value) => {
    setSelectedProductSku(value);
    let productGroups = productSkus?.find(
      (productSKU) => productSKU.slug === value
    )?.product_group;
    productGroups.push(slug);
    productSKUGroupUpdate({
      slug: value,
      form_data: { product_group: productGroups },
    });
  };

  const onPublishProductGroup = useMutation(
    ({ slug, shouldPublish }) => publishProductGroup({ slug, shouldPublish }),
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Rasan Choices Updated"),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchProductGroup(),
    }
  );

  const { data: productSkus } = useQuery({
    queryFn: () => getAllProductSkus(),
    queryKey: GET_ALL_PRODUCT_SKUS,
  });

  const navigate = useNavigate();

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
          <div className="flex items-center gap-3">
            <img
              alt={"text"}
              className="h-[40px] rounded"
              src={record?.product_sku_image?.full_size || "/rasan-default.png"}
            />
            {record.name}
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
              className="text-red-500 text-xl p-4 flex items-center justify-center"
              type="button"
              onClick={() => {}}
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
      {productGroupStatus === "loading" && <Loader isOpen />}

      {isEditGroupOpen && (
        <EditProductGroup
          closeModal={() => setIsEditGroupOpen(false)}
          isOpen={isEditGroupOpen}
          slug={slug}
        />
      )}

      {productGroupData && (
        <>
          <CustomPageHeader path="/product-groups" title={productGroup.name} />

          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh]">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[150px] h-[150px]">
                  <img
                    alt="product"
                    className="w-[100%] h-[100%] object-cover"
                    src={
                      productGroup.product_group_image.thumbnail ||
                      DEFAULT_RASAN_IMAGE
                    }
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
                  <Space>
                    <Button
                      loading={onPublishProductGroup.status === "loading"}
                      type={productGroup.is_published ? "danger" : "primary"}
                      onClick={() =>
                        onPublishProductGroup.mutate({
                          slug: productGroup.slug,
                          shouldPublish: !productGroup.is_published,
                        })
                      }
                    >
                      {productGroup.is_published ? "Unpublish" : "Publish"}
                    </Button>

                    <Button
                      type="ghost"
                      onClick={() => setIsEditGroupOpen(true)}
                    >
                      Edit Details
                    </Button>
                  </Space>
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
                    className="w-[75%]"
                    columns={columns}
                    dataSource={productGroup?.product_skus?.results}
                    pagination={false}
                    rowClassName="h-[3rem] cursor-pointer"
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          const pageHeaderPath = `/product-groups/${productGroup.slug}`;
                          navigate(
                            `/product-sku/${record.slug}?path=${pageHeaderPath}`
                          );
                        },
                      };
                    }}
                  />
                </div>
                <div>
                  <form>
                    <Select
                      placeholder={`Add Product SKU to ${productGroup.name}`}
                      style={{
                        width: 400,
                        marginTop: "1rem",
                      }}
                      value={selectedProductSku}
                      showSearch
                      onChange={(value) => addProductSKUToGroup(value)}
                    >
                      {productSkus
                        ?.filter(
                          (productSKU) =>
                            !productSKU.product_group.includes(slug)
                        )
                        .map((productSKU) => (
                          <Option key={productSKU.slug} value={productSKU.slug}>
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
