import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProduct } from "../../context/CategoryContext";
import { getDate, parseSlug } from "../../utility";
import SimpleAlert from "../alerts/SimpleAlert";
import EditProductList from "./EditProductList";

function ViewProductList() {
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
  const { slug } = useParams();
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[3];
  } catch (error) {
    categorySlug = null;
  }
  const [productList, setProductList] = useState({
    sn: "",
    name: "",
    slug: "",
    brand: "",
    category: [],
    alternate_products: [],
    supplementary_products: [],
    includes_vat: "",
    is_published: "",
    product_image: "",
  });
  const {
    data: productData,
    isLoading: getProductIsLoading,
    isError: getProductIsError,
    error: getProductError,
  } = useQuery(["get-product", slug], () => getProduct({ slug }), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setProductList(data.data.data);
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
        <EditProductList alert={alert} setAlert={setAlert} />
      )}
      {getProductIsLoading && <div>Loading....</div>}
      {getProductIsError && <div>Error: {getProductError.message}</div>}
      {productData && (
        <>
          <div className="text-3xl bg-white p-5 mb-7">{productList.name}</div>
          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh] max-w-[70%]">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[100px] h-[150px]">
                  <img
                    src={productList?.product_image?.full_size}
                    alt="product"
                    className="w-[100%] h-[100%] object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center">
                  <p className="text-[#596579] text-[0.8rem]">Created at: </p>
                  <p className="text-[#596579] font-bold">
                    {productList.published_at
                      ? getDate(productList.published_at)
                      : "-"}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">
                    Last edited at:{" "}
                  </p>
                  <p className="text-[#596579] font-bold">
                    {productList.published_at
                      ? getDate(productList.published_at)
                      : "-"}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">Published at: </p>
                  <p className="text-[#596579] font-bold">
                    {productList.published_at
                      ? getDate(productList.published_at)
                      : "-"}
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
                  <h3 className="text-xl text-[#374253]">
                    Product List Details
                  </h3>
                  {productList.is_published ? (
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
                    <p className="text-[#596579] font-bold">{productList.sn}</p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Product List Name
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productList.name}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Brand</p>
                    <p className="text-[#596579] font-bold">
                      {productList.brand}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Slug</p>
                    <p className="text-[#596579] font-bold">
                      {productList.slug}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Includes VAT</p>
                    <p className="text-[#596579] font-bold">
                      {productList.includes_vat}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1">
                    <p className="text-[#596579] text-[0.8rem]">Category</p>
                    <p className="text-[#596579] font-bold capitalize">
                      {productList.category.map((cat, index) => {
                        if (productList.category.length === index + 1) {
                          return `${parseSlug(cat)}`;
                        } else {
                          return `${parseSlug(cat)}, `;
                        }
                      })}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Alternative Products
                    </p>
                    <p className="text-[#596579] font-bold capitalize">
                      {productList.alternate_products.map((cat, index) => {
                        if (
                          productList.alternate_products.length ===
                          index + 1
                        ) {
                          return `${parseSlug(cat)}`;
                        } else {
                          return `${parseSlug(cat)}, `;
                        }
                      })}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Supplementary Products
                    </p>
                    <p className="text-[#596579] font-bold capitalize">
                      {productList.supplementary_products.map((cat, index) => {
                        if (
                          productList.supplementary_products.length ===
                          index + 1
                        ) {
                          return `${parseSlug(cat)}`;
                        } else {
                          return `${parseSlug(cat)}, `;
                        }
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProductList;
