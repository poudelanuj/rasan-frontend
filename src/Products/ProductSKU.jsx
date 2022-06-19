import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProductSKU } from "../context/CategoryContext";
import { getDate } from "../utility";

function ProductSKU() {
  const { slug } = useParams();
  const {
    data: getProductSkuData,
    isLoading: getProductSkuIsLoading,
    isError: getProductSkuIsError,
    error: getProductSkuError,
  } = useQuery(["get-product-sku", slug], () => getProductSKU({ slug }), {
    onSuccess: (data) => {
      console.log(data);
    },
  });
  return (
    <>
      {getProductSkuIsLoading && <div>Loading....</div>}
      {getProductSkuIsError && <div>Error: {getProductSkuError.message}</div>}
      {getProductSkuData && (
        <>
          <div className="text-3xl bg-white p-5 mb-7">
            {getProductSkuData.data.data.name}
          </div>
          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh] max-w-[70%]">
            <div>
              <div className="flex justify-start">
                <div className="w-40">
                  <img
                    src={
                      getProductSkuData.data.data.product_sku_image.full_size
                    }
                    alt="product"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2">
                  <p>Created at: </p>
                  <p>{getDate(getProductSkuData.data.data.published_at)}</p>
                  <p>Last edited at: </p>
                  <p>{getDate(getProductSkuData.data.data.published_at)}</p>
                  <p>Published at: </p>
                  <p>{getDate(getProductSkuData.data.data.published_at)}</p>
                </div>
              </div>
              <div>
                lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quisquam. fjdlkasjflkjaskldfjklajdflkajlfda
              </div>
            </div>
            <div>
              lkjasdlfjklasjdflkjaslkdjflkasdfjalsdjflkasdflkasfa sfasd
              fasdkfjasdklfas df asdfja
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductSKU;
