import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProductPack, getProductSKU } from "../context/CategoryContext";
import { getDate, parseSlug } from "../utility";
import SimpleAlert from "./alerts/SimpleAlert";
import AddProductPack from "./ProductSku/AddProductPack";
import EditProductPack from "./ProductSku/EditProductPack";
import EditProductSKU from "./ProductSku/EditProductSKU";
import ProductPackList from "./ProductSku/ProductPackList";

function ProductSKU() {
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    text: "",
    type: "",
    primaryButton: "",
    secondaryButton: "",
    image: "",
    action: "",
    actionOn: "",
    icon: "",
  });
  const { slug, id } = useParams();
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[3];
  } catch (error) {
    categorySlug = null;
  }
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
      {alert.show && (
        <SimpleAlert
          action={alert.action}
          alert={alert}
          icon={alert.icon}
          image={alert.image}
          primaryButton={alert.primaryButton}
          secondaryButton={alert.secondaryButton}
          setAlert={setAlert}
          text={alert.text}
          title={alert.title}
          type={alert.type}
        />
      )}
      {categorySlug === "edit" && (
        <EditProductSKU alert={alert} setAlert={setAlert} />
      )}
      {categorySlug === "edit-product-pack" && (
        <EditProductPack alert={alert} setAlert={setAlert} />
      )}
      {categorySlug === "add-product-pack" && (
        <AddProductPack alert={alert} setAlert={setAlert} />
      )}
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
                  <Link
                    to={"edit"}
                    className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
                  >
                    <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                    Details
                  </Link>
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
                    <p className="text-[#596579] font-bold capitalize">
                      {productSKU.category.map((category, index) => {
                        if (index === productSKU.category.length - 1) {
                          return parseSlug(category);
                        } else {
                          return parseSlug(category) + ", ";
                        }
                      })}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Product Group
                    </p>
                    <p className="text-[#596579] font-bold capitalize">
                      {productSKU.product_group.map((group, index) => {
                        if (index === productSKU.product_group.length - 1) {
                          return parseSlug(group);
                        } else {
                          return parseSlug(group) + ", ";
                        }
                      })}
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
            {productSKU?.product_packs.length > 0 ? (
              <ProductPackList id={productSKU.product_packs[0].id} />
            ) : (
              <div className="mt-[1rem]">
                <p className="flex justify-start items-center">
                  No Product Packs Found
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ProductSKU;
