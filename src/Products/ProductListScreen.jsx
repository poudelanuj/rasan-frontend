import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProducts } from "../context/CategoryContext";
import Header from "./subComponents/Header";
// import SearchBox from "./subComponents/SearchBox";

import TabAll from "./ProductList/TabAll";

function ProductListScreen() {
  const { data, isLoading, isError, error } = useQuery(
    "get-products",
    getProducts
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
            <Header title="Products List" />
            <TabAll />
          </div>
        )}
      </>
    </>
  );
}

export default ProductListScreen;
