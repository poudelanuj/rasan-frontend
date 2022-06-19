import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProductSKUs } from "../context/CategoryContext";
import Header from "./subComponents/Header";

import TabAll from "./ProductSku/TabAll";

function ProductSkuScreen() {
  const { data, isLoading, isError, error } = useQuery(
    "get-product-skus",
    getProductSKUs
  );
  const location = useLocation();
  let brandSlug;
  try {
    brandSlug = location.pathname.split("/")[2];
  } catch (error) {
    brandSlug = null;
  }
  const brands = data?.data?.data?.results;
  return (
    <>
      <>
        {isLoading && <div>Loading....</div>}
        {isError && <div>Error: {error.message}</div>}
        {data && (
          <div>
            <Header title="Products SKUs" />
            <TabAll />
          </div>
        )}
      </>
    </>
  );
}

export default ProductSkuScreen;
