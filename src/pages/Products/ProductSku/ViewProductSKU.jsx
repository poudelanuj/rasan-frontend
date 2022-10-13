import { EditOutlined } from "@ant-design/icons";
import { Descriptions, Divider, Tag, Space, Spin, Breadcrumb } from "antd";
import moment from "moment";
import { useCallback } from "react";
import { useQuery, useMutation } from "react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getProductSku,
  publishProductSku,
  unpublishProductSku,
} from "../../../api/products/productSku";
import { GET_PRODUCT_SKU } from "../../../constants/queryKeys";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import { parseSlug } from "../../../utils";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import ProductPackList from "./ProductPack/ProductPackList";

function ProductSKU() {
  const { slug } = useParams();
  const [searchParam] = useSearchParams();
  const pageHeaderPath = searchParam.get("path");

  const {
    data: productSku,
    status: productSkustatus,
    refetch: refetchProductSku,
  } = useQuery([GET_PRODUCT_SKU, slug], () => getProductSku(slug));

  const handlePublish = useMutation(
    (bool) => (bool ? publishProductSku(slug) : unpublishProductSku(slug)),
    {
      onSuccess: (data) => openSuccessNotification(data.message),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchProductSku(),
    }
  );

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-list">Product SKUs</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{productSku?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, [productSku]);

  return (
    <>
      {productSkustatus === "loading" && <Loader isOpen />}
      {productSkustatus === "success" && productSku && (
        <>
          <CustomPageHeader
            breadcrumb={getHeaderBreadcrumb()}
            path={pageHeaderPath}
            title={productSku.name}
          />

          <div className="flex flex-col bg-white p-6 rounded-lg">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[200px] h-[200px] rounded ">
                  <img
                    alt="product"
                    className="w-[100%] h-[100%] rounded object-cover"
                    src={productSku?.product_sku_image?.full_size}
                  />
                </div>

                <div className="w-[50%] mx-8">
                  <Descriptions column={1} title="">
                    <Descriptions.Item label="Name">
                      <span className="font-medium">{productSku.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Name (Nepali)">
                      <span className="font-medium">{productSku.name_np}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                      <span className="font-medium">
                        {Array.isArray(productSku.category)
                          ? productSku.category.map((item) => (
                              <span
                                key={item}
                                className="mr-2 cursor-pointer hover:underline"
                              >
                                {parseSlug(item)}
                              </span>
                            ))
                          : productSku.category}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Brand">
                      <span className="font-medium">
                        {Array.isArray(productSku.brand) ? (
                          productSku.brand.map((item) => (
                            <span
                              key={item}
                              className="mr-2 cursor-pointer hover:underline"
                            >
                              {parseSlug(item)}
                            </span>
                          ))
                        ) : (
                          <span className="mr-2 cursor-pointer hover:underline">
                            {productSku.brand}
                          </span>
                        )}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Published">
                      <Tag color={productSku.is_published ? "green" : "orange"}>
                        {productSku.is_published
                          ? "Published"
                          : "Not Published"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <div className="absolute top-0 right-0">
                  <Space>
                    <ButtonWPermission
                      className="rounded"
                      codename="change_productsku"
                      disabled={handlePublish.status === "loading"}
                      type={productSku.is_published ? "danger" : "primary"}
                      onClick={() =>
                        handlePublish.mutate(!productSku.is_published)
                      }
                    >
                      {handlePublish.status === "loading" ? (
                        <Spin size="small" />
                      ) : (
                        <span>
                          {productSku.is_published ? "Unpublish" : "Publish"}
                        </span>
                      )}
                    </ButtonWPermission>
                    <ButtonWPermission
                      className="!text-[#00A0B0] !bg-inherit !border-none"
                      codename="change_productsku"
                    >
                      <Link to={"edit"}>
                        <EditOutlined style={{ verticalAlign: "middle" }} />{" "}
                        Edit Details
                      </Link>
                    </ButtonWPermission>
                  </Space>
                </div>
              </div>

              <Divider />

              <div className="mt-[1rem]">
                <div className="mb-4">
                  <h3 className="text-xl text-[#374253]">
                    Product SKU Details
                  </h3>
                </div>

                <Descriptions column={3} size="middle" bordered>
                  <Descriptions.Item label="S.No">
                    <span className="font-medium">{productSku.sn}</span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Quantity">
                    <span className="font-medium">{productSku.quantity}</span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Cost Price/Piece">
                    <span className="font-medium">
                      {productSku.cost_price_per_piece}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Price/Piece">
                    <span className="font-medium">
                      {productSku.price_per_piece}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="MRP Price/Piece">
                    <span className="font-medium">
                      {productSku.mrp_per_piece}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Published At">
                    <span className="font-medium">
                      {productSku.published_at
                        ? moment(productSku.published_at).format("ll")
                        : productSku.published_at}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Product Group" span={3}>
                    <span className="font-medium">
                      {Array.isArray(productSku.product_group)
                        ? productSku.product_group.map((item) => (
                            <span
                              key={item}
                              className="mr-2 cursor-pointer hover:underline"
                            >
                              {parseSlug(item)}
                            </span>
                          ))
                        : productSku.product_group}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Product" span={3}>
                    <span className="font-medium">{productSku.product}</span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Description" span={3}>
                    <span className="font-medium">
                      {productSku.description}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            <Divider />

            <ProductPackList
              productPacks={productSku?.product_packs}
              productSkuSlug={productSku?.slug}
              refetchProductSku={refetchProductSku}
            />
          </div>
        </>
      )}
    </>
  );
}

export default ProductSKU;
