import { useQuery } from "react-query";
import { getProducts } from "../context/CategoryContext";
import Header from "./subComponents/Header";

import TabAll from "./ProductList/TabAll";
import Loader from "./subComponents/Loader";

function ProductListScreen() {
  const { data, isLoading } = useQuery("get-products", getProducts);
  return (
    <>
      <>
        {isLoading && <Loader loadingText={"Loading Products..."} />}
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
