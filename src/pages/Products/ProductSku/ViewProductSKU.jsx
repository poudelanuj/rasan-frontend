import { Breadcrumb, Tabs } from "antd";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { Link, useParams, useLocation } from "react-router-dom";
import { getProductSku } from "../../../api/products/productSku";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";
import { GET_PRODUCT_SKU } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import ProductSkuDetails from "./ProductSkuDetails";

function ProductSKU() {
  const { slug } = useParams();

  const { search } = useLocation();

  const {
    data: productSku,
    status: productSkustatus,
    refetch: refetchProductSku,
  } = useQuery([GET_PRODUCT_SKU, slug], () => getProductSku(slug));

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-list">Product SKU</Link>
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
            path={`/product-sku?search=${new URLSearchParams(search).get(
              "search"
            )}`}
            title={productSku.name}
          />

          <div className="flex flex-col bg-white p-6 rounded-lg">
            <Tabs>
              <Tabs.TabPane key="productSkuDetails" tab="Product SKU Details">
                <ProductSkuDetails
                  productSku={productSku}
                  refetchProductSku={refetchProductSku}
                  slug={slug}
                />
              </Tabs.TabPane>

              <Tabs.TabPane
                key="analytics"
                className="!w-[98%]"
                tab="Analytics"
              >
                {productSku && (
                  <OrderAnalytics product_sku_id={productSku.id} />
                )}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
}

export default ProductSKU;
