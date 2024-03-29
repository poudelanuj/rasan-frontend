import { DeleteOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Select, Space, Table, Tag } from "antd";
import moment from "moment/moment";
import {
  getProductGroup,
  updateProductSKU,
} from "../../../context/CategoryContext";
import { deleteProductSku } from "../../../api/products/productSku";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { getAllProductSkus } from "../../../api/products/productSku";
import { GET_ALL_PRODUCT_SKUS } from "../../../constants/queryKeys";
import { parseArray } from "../../../utils";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import CustomPageHeader from "../../../shared/PageHeader";
import { publishProductGroup } from "../../../api/products/productGroups";
import Loader from "../../../shared/Loader";
import EditProductGroup from "./EditProductGroup";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { useEffect } from "react";

const { Option } = Select;

function ViewProductGroup() {
  const queryClient = useQueryClient();

  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const { slug } = useParams();

  const [isDeleteProductSkuModal, setIsDeleteProductSkuModal] = useState({
    isOpen: false,
    slug: null,
    title: null,
  });

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
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  useEffect(() => {
    if (productGroupData) {
      let newData = productGroupData.data.data;
      newData.product_skus.results.forEach((productSku) => {
        productSku["key"] = productSku.slug;
      });
      setProductGroup(newData);
    }
  }, [productGroupData]);

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

  const handleDeleteProductSku = useMutation((slug) => deleteProductSku(slug), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      setIsDeleteProductSkuModal({ isOpen: false, slug: null, title: null });
      refetchProductGroup();
    },
    onError: (err) => openErrorNotification(err),
  });

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
          <div
            className="flex items-center gap-3 text-blue-500"
            onClick={() => {
              const pageHeaderPath = `/product-groups/${productGroup.slug}`;
              navigate(`/product-sku/${record.slug}?path=${pageHeaderPath}`);
            }}
          >
            <img
              alt={"text"}
              className="h-[40px] w-9 rounded"
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
          <Tag color={record.is_published ? "green" : "orange"}>
            {record.is_published ? "PUBLISHED" : "UNPUBLISHED"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (text, record) => {
        return (
          <div className="flex items-center">
            <ButtonWPermission
              codename="delete_productsku"
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsDeleteProductSkuModal({
                  ...isDeleteProductSkuModal,
                  slug: record.slug,
                  isOpen: true,
                  title: record.name,
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-groups">Rasan Choices</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{productGroup?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, [productGroup]);

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

      {productGroupStatus === "success" && productGroupData && (
        <>
          <CustomPageHeader
            breadcrumb={getHeaderBreadcrumb()}
            path="/product-groups"
            title={productGroup.name}
          />

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
                    <ButtonWPermission
                      codename="change_productgroup"
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
                    </ButtonWPermission>

                    <ButtonWPermission
                      codename="change_productgroup"
                      type="ghost"
                      onClick={() => setIsEditGroupOpen(true)}
                    >
                      Edit Details
                    </ButtonWPermission>
                  </Space>
                </div>
              </div>
              <div className="mt-[1rem]">
                <Space className="flex justify-start items-center" size="large">
                  <h3 className="text-xl m-0 text-[#374253]">
                    Rasan Choice Details
                  </h3>
                  <Tag color={productGroup.is_published ? "green" : "orange"}>
                    {productGroup.is_published ? "PUBLISHED" : "UNPUBLISHED"}
                  </Tag>
                </Space>
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
                          ? moment(productGroup.published_at).format("ll")
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
                    rowClassName="h-[3rem] cursor-pointer"
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

          <ConfirmDelete
            closeModal={() =>
              setIsDeleteProductSkuModal({
                ...isDeleteProductSkuModal,
                slug: null,
                isOpen: false,
                title: null,
              })
            }
            deleteMutation={() =>
              handleDeleteProductSku.mutate(isDeleteProductSkuModal.slug)
            }
            isOpen={isDeleteProductSkuModal.isOpen}
            status={handleDeleteProductSku.status}
            title={isDeleteProductSkuModal.title}
          />
        </>
      )}
    </>
  );
}

export default ViewProductGroup;
