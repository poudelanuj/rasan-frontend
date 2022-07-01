import { useQuery } from "react-query";
import { getProductSKUs } from "../context/CategoryContext";
import Header from "./subComponents/Header";

import TabAll from "./ProductSku/TabAll";
import Loader from "../shared/Loader";

function ProductSkuScreen() {
  const { data, status } = useQuery("get-product-skus", getProductSKUs);

  return (
    <>
      <>
        {status === "loading" && <Loader isOpen />}
        {status === "success" && data && (
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
