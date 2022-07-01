import { useQuery } from "react-query";
import { getProducts } from "../context/CategoryContext";
import Header from "./subComponents/Header";

import TabAll from "./ProductList/TabAll";
import Loader from "../shared/Loader";

function ProductListScreen() {
  const { data, status } = useQuery("get-products", getProducts);

  return (
    <div>
      {status === "loading" && <Loader isOpen />}
      {status === "success" && data && (
        <div>
          <Header title="Products List" />
          <TabAll />
        </div>
      )}
    </div>
  );
}

export default ProductListScreen;
