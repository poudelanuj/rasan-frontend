import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  getCategories,
  getBrands,
  getLoyaltyPolicies,
  getProducts,
  createProduct,
} from "../../context/CategoryContext";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { message, Upload } from "antd";
const { Dragger } = Upload;

function AddProductList({ alert, setAlert }) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    product_image: "",
    brand: "",
    category: [],
    loyalty_policy: [],
    supplementary_products: [],
    alternate_Products: [],
    includes_vat: false,
    imageFile: null,
  });
  const [optionsData, setOptionsData] = useState({
    categories: [],
    brands: [],
    loyaltyPolicies: [],
    products: [],
  });
  const queryClient = useQueryClient();

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery("get-categories", getCategories, {
    onSuccess: (data) => {
      console.log("categoriesData", data);
      setOptionsData({
        ...optionsData,
        categories: data.data.data.results,
      });
    },
  });
  const {
    data: brandsData,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
    error: errorBrands,
  } = useQuery("get-brands", getBrands, {
    onSuccess: (data) => {
      console.log("brandsData", data);
      setOptionsData({
        ...optionsData,
        brands: data.data.data.results,
      });
    },
  });
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery("get-products", getProducts, {
    onSuccess: (data) => {
      console.log("productsData", data);
      setOptionsData({
        ...optionsData,
        products: data.data.data.results,
      });
    },
  });
  const {
    data: loyaltyPoliciesData,
    isLoading: isLoadingLoyaltyPolicies,
    isError: isErrorLoyaltyPolicies,
    error: errorLoyaltyPolicies,
  } = useQuery("get-loyalty-policies", getLoyaltyPolicies, {
    onSuccess: (data) => {
      console.log(data, "loyalty-policies");
      setOptionsData({
        ...optionsData,
        loyaltyPolicies: data.data.data.results,
      });
    },
  });

  const {
    mutate: createProductMutate,
    isLoading: isLoadingProductMutate,
    isError: isErrorProductMutate,
    error: errorProductMutate,
    data: createProductData,
  } = useMutation(({ form_data }) => createProduct({ form_data }), {
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.invalidateQueries("get-products");
      message.success("Product List created successfully");
      navigate("/product-list/");
    },
  });

  const closeProductAddWidget = () => {
    navigate("/product-list");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
  const handleSave = async () => {
    if (
      formState.name &&
      formState.product_image &&
      formState.brand &&
      formState.category &&
      formState.loyalty_policy &&
      formState.supplementary_products &&
      formState.alternate_Products
    ) {
      let form_data = new FormData();
      for (let key in formState) {
        if (key === "category") {
          for (let i = 0; i < formState[key].length; i++) {
            form_data.append("category[]", formState[key][i]);
          }
        } else if (key === "alternate_products") {
          for (let i = 0; i < formState[key].length; i++) {
            form_data.append("alternate_products[]", formState[key][i]);
          }
        } else if (key === "supplementary_products") {
          for (let i = 0; i < formState[key].length; i++) {
            form_data.append("supplementary_products[]", formState[key][i]);
          }
        } else if (key === "product_image") {
          if (formState.imageFile) {
            form_data.append("product_image", formState.imageFile);
          }
        } else {
          form_data.append(key, formState[key]);
        }
      }
      createProductMutate({ form_data });
      return createProductData?.data?.data?.slug || true;
    } else {
      console.log("Please fill all the fields");
      message.error("Please fill all the fields");
      return false;
    }
  };
  const handlePublish = async () => {
    const isSaved = await handleSave();
    if (isSaved) {
      // publishCategoryMutate({ isSaved });
      message.success("Category published successfully");
    }
  };
  const props = {
    maxCount: 1,
    multiple: false,
    beforeUpload: () => false,
    showUploadList: false,

    onChange: (filename) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (filename.file) {
          setFormState({
            ...formState,
            product_image: e.target.result,
            imageFile: filename.file,
          });
        }
      };
      reader.readAsDataURL(filename.file);
    },
    style: {
      padding: "0px",
    },
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

  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen z-[99990]"
        onClick={() => closeProductAddWidget()}
      ></div>
      <div className="w-[36.25rem] overflow-y-auto h-[90%] fixed z-[99999] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col px-8 py-4 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <h2 className="text-3xl mb-3 text-[#192638] text-[2rem] font-medium">
          Add Product
        </h2>
        {(isLoadingCategories ||
          isLoadingBrands ||
          isLoadingLoyaltyPolicies ||
          isLoadingProductMutate) && (
          <div className="absolute top-0 right-0 bg-black/25 w-full h-full flex flex-col items-center justify-center z-50 animate-popupopen">
            <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
            <span className="p-2 text-white">Loading...</span>
          </div>
        )}
        <form
          className="flex flex-col justify-between flex-1"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-[0.8rem] grid-cols-[100%]">
            <Dragger {...props}>
              <p
                className="ant-upload-drag-icon"
                style={{ marginBottom: "5px" }}
              >
                <img
                  alt="gallery"
                  className="h-[4rem] mx-auto"
                  src={
                    formState.product_image
                      ? formState.product_image
                      : "/gallery-icon.svg"
                  }
                />
              </p>
              <p className="ant-upload-text text-[13px]">
                <UploadOutlined style={{ verticalAlign: "middle" }} />
                <span> Click or drag file to this area to upload</span>
              </p>
            </Dragger>
            <div className="">
              <div className="flex flex-col">
                <label className="mb-1 text-[#596579]" htmlFor="name">
                  Product Name
                </label>
                <input
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  id="name"
                  placeholder="Eg. Rice"
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex flex-col">
                <label className="mb-1 text-[#596579]" htmlFor="category">
                  Category
                </label>
                <select
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  value={formState.category}
                  id="category"
                  onChange={(e) => {
                    let options = e.target.options;
                    let value = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    console.log(formState);
                    return setFormState({ ...formState, category: value });
                  }}
                  multiple={true}
                >
                  <option value="">Select Category</option>
                  {optionsData.categories.map((category) => (
                    <option
                      key={category.slug}
                      value={category.slug}
                    >{`${category.name}`}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[#596579]" htmlFor="category">
                  Alternate Products
                </label>
                <select
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  value={formState.alternate_products}
                  id="category"
                  onChange={(e) => {
                    let options = e.target.options;
                    let value = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    console.log(formState);
                    return setFormState({
                      ...formState,
                      alternate_products: value,
                    });
                  }}
                  multiple={true}
                >
                  <option value="">Select Category</option>
                  {optionsData.products.map((product) => (
                    <option
                      key={product.slug}
                      value={product.slug}
                    >{`${product.name}`}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[#596579]" htmlFor="category">
                  Supplementary Product
                </label>
                <select
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  value={formState.supplementary_products}
                  id="category"
                  onChange={(e) => {
                    let options = e.target.options;
                    let value = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    console.log(formState);
                    return setFormState({
                      ...formState,
                      supplementary_products: value,
                    });
                  }}
                  multiple={true}
                >
                  <option value="">Select Category</option>
                  {optionsData.products.map((product) => (
                    <option
                      key={product.slug}
                      value={product.slug}
                    >{`${product.name}`}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[#596579]" htmlFor="brand">
                  Brand
                </label>
                <select
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  value={formState.brand}
                  id="brand"
                  onChange={(e) =>
                    setFormState({ ...formState, brand: e.target.value })
                  }
                >
                  <option value="">Select Brand</option>
                  {optionsData.brands.map((brand) => (
                    <option key={brand.slug} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-[#596579]"
                    htmlFor="loyalty_policy"
                  >
                    Loyalty Policy
                  </label>
                  <select
                    className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                    value={formState.loyalty_policy}
                    id="loyalty_policy"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        loyalty_policy: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Loyalty Policy</option>
                    {optionsData.loyaltyPolicies.map((loyaltyPolicy) => (
                      <option
                        key={loyaltyPolicy.id}
                        value={loyaltyPolicy.id}
                      >{`${loyaltyPolicy.remarks}`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includes_vat"
                  value={formState.includes_vat}
                  onChange={(e) =>
                    setFormState({ ...formState, includes_vat: e.target.value })
                  }
                />
                <label
                  className="ml-1 mb-1 text-[#596579] cursor-pointer"
                  htmlFor="includes_vat"
                >
                  Includes VAT
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors"
              type="button"
              onClick={async () => {
                let isSaved = await handleSave();
                if (isSaved) {
                  return closeProductAddWidget();
                }
              }}
            >
              Create
            </button>
            <button
              className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
              type="button"
              onClick={async () =>
                showAlert({
                  title: "Are you sure to Publish?",
                  text: "Publishing this category would save it and make it visible to the public!",
                  primaryButton: "Publish",
                  secondaryButton: "Cancel",
                  type: "info",
                  image: "/publish-icon.svg",
                  action: async () => {
                    await handlePublish();
                    return closeProductAddWidget();
                  },
                })
              }
            >
              Publish Product SKU
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProductList;
