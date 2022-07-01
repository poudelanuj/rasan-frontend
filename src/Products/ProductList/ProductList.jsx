import { EditOutlined } from "@ant-design/icons";
import { Descriptions, Divider, Tag } from "antd";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../../api/products";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import { parseSlug } from "../../utility";

function ViewProduct() {
  const { slug } = useParams();

  const { data: product, status: productStatus } = useQuery(
    ["get-product", slug],
    () => getProduct(slug)
  );

  return (
    <>
      {productStatus === "loading" && <Loader isOpen />}
      {product && (
        <>
          <div className="mt-4">
            <CustomPageHeader title={product.name} />
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
                  <Link
                    className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
                    to={"edit"}
                  >
                    <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                    Details
                  </Link>
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
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProduct;
