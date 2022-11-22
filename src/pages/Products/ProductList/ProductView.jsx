import React, { useCallback } from "react";
import { Breadcrumb, Tabs } from "antd";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../../../api/products";
import { GET_PRODUCT } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";

import ProductAnalytics from "./ProductAnalytics";
import ProductDetails from "./ProductDetails";

function ViewProduct() {
  const { slug } = useParams();

  const {
    data: product,
    status: productStatus,
    refetch: refetchProduct,
  } = useQuery([GET_PRODUCT, slug], () => getProduct(slug));

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-list">Products</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, [product]);

  return (
    <>
      {productStatus === "loading" && <Loader isOpen />}

      {product && (
        <>
          <CustomPageHeader
            breadcrumb={getHeaderBreadcrumb()}
            title={product.name}
          />

          <div className="flex flex-col bg-white p-6 rounded-lg">
            <Tabs defaultActiveKey="productDetail">
              <Tabs.TabPane key="productDetails" tab="Product Details">
                <ProductDetails
                  product={product}
                  refetchProduct={refetchProduct}
                  slug={slug}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key="analytics" tab="Analytics">
                {product && <ProductAnalytics product_id={product.id} />}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProduct;
