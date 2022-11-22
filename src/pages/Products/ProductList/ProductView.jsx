import React, { useCallback } from "react";
import { Breadcrumb, Tabs } from "antd";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../../../api/products";
import { GET_PRODUCT } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import ProductDetails from "./ProductDetails";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";

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
              <Tabs.TabPane
                key="analytics"
                className="!w-[98%]"
                tab="Analytics"
              >
                {product && <OrderAnalytics product_id={product.id} />}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProduct;
