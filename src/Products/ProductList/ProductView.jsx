import { EditOutlined } from "@ant-design/icons";
import { Descriptions, Divider, Tag, Button, Spin, Space } from "antd";
import moment from "moment";
import React from "react";
import { useQuery, useMutation } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  getProduct,
  publishProduct,
  unpublishProduct,
} from "../../api/products";
import { GET_PRODUCT } from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import { parseSlug } from "../../utility";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import ProductSkuList from "./ProductSkuList";

function ViewProduct() {
  const { slug } = useParams();

  const {
    data: product,
    status: productStatus,
    refetch: refetchProduct,
  } = useQuery([GET_PRODUCT, slug], () => getProduct(slug));

  const handlePublish = useMutation(
    (bool) => (bool ? publishProduct(slug) : unpublishProduct(slug)),
    {
      onSuccess: (data) => openSuccessNotification(data.message),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchProduct(),
    }
  );

  return (
    <>
      {productStatus === "loading" && <Loader isOpen />}
      {product && (
        <>
          <div className="mt-4">
            <CustomPageHeader path="../" title={product.name} />
          </div>

          <div className="flex flex-col bg-white p-6 rounded">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[200px] h-[200px] rounded ">
                  <img
                    alt="product"
                    className="w-[100%] h-[100%] rounded object-cover"
                    src={product?.product_image?.full_size}
                  />
                </div>

                <div className="w-[50%] mx-8">
                  <Descriptions column={1} title="">
                    <Descriptions.Item label="Name">
                      <span className="font-medium">{product.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                      <span className="font-medium">
                        {Array.isArray(product.category)
                          ? product.category.map((item) => (
                              <span
                                key={item}
                                className="mr-2 cursor-pointer hover:underline"
                              >
                                {parseSlug(item)}
                              </span>
                            ))
                          : product.category}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Brand">
                      <span className="font-medium">
                        {Array.isArray(product.brand) ? (
                          product.brand.map((item) => (
                            <span
                              key={item}
                              className="mr-2 cursor-pointer hover:underline"
                            >
                              {parseSlug(item)}
                            </span>
                          ))
                        ) : (
                          <span className="mr-2 cursor-pointer hover:underline">
                            {product.brand}
                          </span>
                        )}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Published">
                      <Tag color={product.is_published ? "green" : "orange"}>
                        {product.is_published ? "Published" : "Not Published"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Product SKUs">
                      <span className="font-medium">
                        {product.product_skus?.count}
                      </span>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <div className="absolute top-0 right-0">
                  <Space>
                    <Button
                      className="rounded"
                      disabled={handlePublish.status === "loading"}
                      type={product.is_published ? "danger" : "primary"}
                      onClick={() =>
                        handlePublish.mutate(!product.is_published)
                      }
                    >
                      {handlePublish.status === "loading" ? (
                        <Spin size="small" />
                      ) : (
                        <span>
                          {product.is_published ? "Unpublish" : "Publish"}
                        </span>
                      )}
                    </Button>
                    <Link
                      className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
                      to={"edit"}
                    >
                      <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                      Details
                    </Link>
                  </Space>
                </div>
              </div>

              <Divider />

              <div className="mt-[1rem]">
                <div className="mb-4">
                  <h3 className="text-xl text-[#374253]">Product Details</h3>
                </div>

                <Descriptions column={2} size="middle" bordered>
                  <Descriptions.Item label="S.No">
                    <span className="font-medium">{product.sn}</span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Is Vat Included">
                    <Tag color={product.includes_vat ? "green" : "orange"}>
                      {product.includes_vat ? "Yes" : "No"}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Published At">
                    <span className="font-medium">
                      {product.published_at
                        ? moment(product.published_at).format("ll")
                        : product.published_at}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Alternate Products" span={3}>
                    <span className="font-medium">
                      {product.alternate_products.map((item) => (
                        <span
                          key={item}
                          className="mr-2 cursor-pointer hover:underline"
                        >
                          {parseSlug(item)}
                        </span>
                      ))}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Supplement Products" span={3}>
                    <span className="font-medium">
                      {product.supplementary_products.map((item) => (
                        <span
                          key={item}
                          className="mr-2 cursor-pointer hover:underline"
                        >
                          {parseSlug(item)}
                        </span>
                      ))}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Divider />

              <ProductSkuList
                productSkus={product.product_skus?.results}
                productSlug={product.slug}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProduct;
