import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  getProductSKUs,
  updateProductPack,
  publishProductPack,
  unpublishProductPack,
  getProductPack,
} from "../../context/CategoryContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { message } from "antd";

function EditProductPack({ alert, setAlert }) {
  const { id } = useParams();
  const location = useLocation();
  let slug;
  try {
    slug = location.pathname.split("/")[2];
  } catch (error) {
    slug = null;
  }
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    product_sku: "",
    number_of_items: "",
    price_per_piece: "",
    mrp_per_piece: "",
  });
  const [optionsData, setOptionsData] = useState({
    productSKUs: [],
  });
  const queryClient = useQueryClient();

  const {
    mutate: updateProductPackMutate,
    isLoading: updateProductPackIsLoading,
    data: updateProductPackResponseData,
  } = useMutation(
    ({ form_data }) => updateProductPack({ slug: id, form_data }),
    {
      onSuccess: (data) => {
        message.success("Product Pack updated successfully!");
        queryClient.invalidateQueries("get-product-skus");
        queryClient.invalidateQueries(["get-product-sku", slug]);
      },
      onError: (data) => {},
    }
  );
  const {
    data: productSKUsData,
    isLoading: productSKUsIsLoading,
    error: productSKUsError,
    isError: productSKUsIsError,
  } = useQuery("get-product-skus", getProductSKUs, {
    onSuccess: (data) => {
      setOptionsData({
        productSKUs: data.data.data.results,
      });
      // setFormState({
      //   ...formState,
      //   product_sku: slug,
      // });
    },
  });

  const {
    data: productPackData,
    isLoading: productPackIsLoading,
    error: productPackError,
    isError: productPackIsError,
  } = useQuery(["get-product-pack", id], () => getProductPack({ slug: id }), {
    onSuccess: (data) => {
      console.log(data, "checking inside update product pack");
      setFormState({
        ...formState,
        ...data.data.data,
      });
    },
    // onError: (data) => {
    // }
  });

  const {
    mutate: publishProductPackMutate,
    isLoading: publishProductPackIsLoading,
    data: publishProductPackResponseData,
    error: publishProductPackError,
    isError: publishProductPackIsError,
  } = useMutation(() => publishProductPack({ slug: id }), {
    onSuccess: (data) => {
      message.success("Product Pack published successfully!");
      queryClient.invalidateQueries("get-product-skus");
      queryClient.invalidateQueries(["get-product-sku", slug]);
      queryClient.invalidateQueries(["get-product-pack", id]);
    },
    onError: (data) => {},
  });
  const {
    mutate: unpublishProductPackMutate,
    isLoading: unpublishProductPackIsLoading,
    data: unpublishProductPackResponseData,
    error: unpublishProductPackError,
    isError: unpublishProductPackIsError,
  } = useMutation(() => unpublishProductPack({ slug: id }), {
    onSuccess: (data) => {
      message.success("Product Pack unpublished successfully!");
      queryClient.invalidateQueries("get-product-skus");
      queryClient.invalidateQueries(["get-product-sku", slug]);
      queryClient.invalidateQueries(["get-product-pack", id]);
    },
    onError: (data) => {},
  });

  const closeAddProductPWidget = () => {
    navigate(`/product-sku/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
  const handleSave = async () => {
    if (
      formState.product_sku &&
      formState.number_of_items &&
      formState.price_per_piece &&
      formState.mrp_per_piece
    ) {
      let form_data = new FormData();
      for (let key in formState) {
        form_data.append(key, formState[key]);
      }
      updateProductPackMutate({ form_data });
      return updateProductPackResponseData?.data?.data.slug;
    } else {
      message.error("Please fill all the fields");
      return false;
    }
  };
  const showAlert = ({
    title,
    text,
    primaryButton,
    secondaryButton,
    type,
    image,
    action,
  }) => {
    setAlert({
      show: true,
      title,
      text,
      primaryButton,
      secondaryButton,
      type,
      image,
      action,
    });
  };
  const unPublishHandler = async () => {
    unpublishProductPackMutate();
  };
  const publishHandler = async () => {
    publishProductPackMutate();
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen z-[99990]"
        onClick={() => closeAddProductPWidget()}
      ></div>
      <div className="min-w-[36.25rem] min-h-[33.5rem] fixed z-[99999] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col p-8 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <h2 className="text-3xl mb-3 text-[#192638] text-[2rem] font-medium">
          Edit Product Pack
        </h2>
        {updateProductPackIsLoading ||
          (productPackIsLoading && (
            <div className="absolute top-0 right-0 bg-black/25 w-full h-full flex flex-col items-center justify-center z-50 animate-popupopen">
              <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
              <span className="p-2 text-white">Loading...</span>
            </div>
          ))}
        <form
          className="flex flex-col justify-between flex-1"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-[1rem] grid-cols-[100%]">
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="product-sku">
                Product SKU
              </label>
              <select
                className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                id="product-sku"
                value={formState.product_sku}
                onChange={(e) =>
                  setFormState({ ...formState, product_sku: e.target.value })
                }
              >
                <option value="">Select Product SKU</option>
                {optionsData.productSKUs.map((productSKU) => (
                  <option key={productSKU.slug} value={productSKU.slug}>
                    {productSKU.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <label className="mb-1" htmlFor="number_of_items">
                  Number of Items
                </label>
              </div>
              <input
                className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                id="number_of_items"
                placeholder="Eg. 15"
                type="number"
                value={formState.number_of_items}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    number_of_items: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-x-[1rem]">
              <div className="flex flex-col">
                <div className="flex">
                  <label className="mb-1" htmlFor="number_of_items">
                    Price Per Piece
                  </label>
                </div>
                <input
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  id="number_of_items"
                  placeholder="Eg. 14000"
                  type="number"
                  value={formState.price_per_piece}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      price_per_piece: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  <label className="mb-1" htmlFor="number_of_items">
                    MRP Per Piece
                  </label>
                </div>
                <input
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  id="number_of_items"
                  placeholder="Eg. 15000"
                  type="number"
                  value={formState.mrp_per_piece}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      mrp_per_piece: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            {productPackData?.data?.data?.is_published ? (
              <button
                className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors"
                type="button"
                onClick={async () => unPublishHandler()}
              >
                Unpublish
              </button>
            ) : (
              <button
                className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors"
                type="button"
                onClick={async () => publishHandler()}
              >
                Publish
              </button>
            )}
            <button
              className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
              type="button"
              onClick={async () => {
                await handleSave();
                return closeAddProductPWidget();
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProductPack;
