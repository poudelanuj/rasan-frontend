import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProductSKU } from "../context/CategoryContext";
import { getDate } from "../utility";

function ProductSKU() {
  const { slug } = useParams();
  const [productSKU, setProductSKU] = useState({});
  const {
    data: getProductSkuData,
    isLoading: getProductSkuIsLoading,
    isError: getProductSkuIsError,
    error: getProductSkuError,
  } = useQuery(["get-product-sku", slug], () => getProductSKU({ slug }), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setProductSKU(data.data.data);
    },
  });
  return (
    <>
      {getProductSkuIsLoading && <div>Loading....</div>}
      {getProductSkuIsError && <div>Error: {getProductSkuError.message}</div>}
      {getProductSkuData && (
        <>
          <div className="text-3xl bg-white p-5 mb-7">{productSKU.name}</div>
          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh] max-w-[70%]">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[100px] h-[150px]">
                  <img
                    src={productSKU.product_sku_image.full_size}
                    alt="product"
                    className="w-[100%] h-[100%] object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center">
                  <p className="text-[#596579] text-[0.8rem]">Created at: </p>
                  <p className="text-[#596579] font-bold">
                    {getDate(productSKU.published_at)}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">
                    Last edited at:{" "}
                  </p>
                  <p className="text-[#596579] font-bold">
                    {getDate(productSKU.published_at)}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">Published at: </p>
                  <p className="text-[#596579] font-bold">
                    {getDate(productSKU.published_at)}
                  </p>
                </div>
                <div className="absolute top-0 right-0">
                  <button className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6">
                    <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                    Details
                  </button>
                </div>
              </div>
              <div className="mt-[1rem]">
                <div className="flex justify-start items-center">
                  <h3 className="text-xl text-[#374253]">Product Details</h3>
                  {productSKU.is_published ? (
                    <p className="ml-[6rem] rounded-full bg-[#E4FEEF] text-[#0E9E49] px-[1rem] py-[2px]">
                      Published
                    </p>
                  ) : (
                    <p className="ml-[6rem] rounded-full bg-[#FFF8E1] text-[#FF8F00] px-[1rem] py-[2px]">
                      Unpublished
                    </p>
                  )}
                </div>
                <div className="mt-[0.5rem] flex">
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1">
                    <p className="text-[#596579] text-[0.8rem]">Sno.</p>
                    <p className="text-[#596579] font-bold">{productSKU.sn}</p>

                    <p className="text-[#596579] text-[0.8rem]">Product Name</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.name}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Description</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.description}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Alternate Products
                    </p>
                    <p className="text-[#596579] font-bold">123456</p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Supplementary Products
                    </p>
                    <p className="text-[#596579] font-bold">123456</p>
                  </div>
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1">
                    <p className="text-[#596579] text-[0.8rem]">Brand</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.brand}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Category</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.category[0]}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Product Group
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.product_group[0]}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Loyalty Policy
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.loyalty_policy}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Quantity</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.quantity}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Price/piece</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.price_per_piece}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      CostPrice/Piece
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.cost_price_per_piece}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">MRP/Piece</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.mrp_per_piece}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Slug</p>
                    <p className="text-[#596579] font-bold">
                      {productSKU.slug}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Includes VAT</p>
                    <p className="text-[#596579] font-bold">Yes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[1rem] relative">
              <div className="flex justify-start items-center">
                <h3 className="text-xl text-[#374253]">Product Pack</h3>
                {productSKU.is_published ? (
                  <p className="ml-[6rem] rounded-full bg-[#E4FEEF] text-[#0E9E49] px-[1rem] py-[2px]">
                    Published
                  </p>
                ) : (
                  <p className="ml-[6rem] rounded-full bg-[#FFF8E1] text-[#FF8F00] px-[1rem] py-[2px]">
                    Unpublished
                  </p>
                )}
              </div>
              <div className="absolute top-0 right-0">
                <button className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6">
                  <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                  Details
                </button>
              </div>
              <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center w-[50%] mt-[0.5rem]">
                <p className="text-[#596579] text-[0.8rem]">S.N.</p>
                <p className="text-[#596579] font-bold">{productSKU.sn}</p>

                <p className="text-[#596579] text-[0.8rem]">No. of items</p>
                <p className="text-[#596579] font-bold">
                  {productSKU.product_packs?.length}
                </p>

                <p className="text-[#596579] text-[0.8rem]">Price/Piece</p>
                <p className="text-[#596579] font-bold">
                  {productSKU.description}
                </p>

                <p className="text-[#596579] text-[0.8rem]">MRP/Piece</p>
                <p className="text-[#596579] font-bold">123456</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductSKU;
