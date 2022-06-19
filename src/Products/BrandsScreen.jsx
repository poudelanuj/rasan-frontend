import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import {
  deleteBrand,
  getBrands,
  publishBrand,
  unpublishBrand,
} from "../context/CategoryContext";
import AddBrand from "./Brands/AddBrand";
import EditBrand from "./Brands/EditBrand";
import CategoryWidget from "./CategoryWidget";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import Header from "./subComponents/Header";
import SearchBox from "./subComponents/SearchBox";

import { message, Pagination, Select } from "antd";
import SimpleAlert from "./alerts/SimpleAlert";
const { Option } = Select;

function BrandsScreen() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { data } = useQuery("get-brands", () => getBrands({ currentPage }));

  const queryClient = useQueryClient();
  const { slug } = useParams();

  const {
    mutate: publishCategoryMutate,
    isLoading: publishCategoryIsLoading,
    isError: publishCategoryIsError,
    error: publishCategoryError,
  } = useMutation(publishBrand, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-brands");
    },
  });
  const {
    mutate: unpublishCategoryMutate,
    isLoading: unpublishCategoryIsLoading,
    isError: unpublishCategoryIsError,
    error: unpublishCategoryError,
  } = useMutation(unpublishBrand, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-brands");
    },
  });
  const {
    mutate: deleteMutate,
    isLoading: deleteCategoryIsLoading,
    isError: deleteCategoryIsError,
    error: deleteCategoryError,
  } = useMutation(deleteBrand, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-brands");
    },
  });

  const location = useLocation();
  let brandSlug;
  try {
    brandSlug = location.pathname.split("/")[2];
  } catch (error) {
    brandSlug = null;
  }

  const paginate = async (page) => {
    console.log(page);
    setCurrentPage(page);
  };

  const brands = data?.data?.data?.results;
  console.log(data);

  const handleBulkPublish = () => {
    console.log("bluk publishing");
    console.log(selectedBrands);
    selectedBrands.forEach(async (category) => {
      console.log("Publishing", category.slug);
      publishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} published`);
    });
    setSelectedBrands([]);
  };
  const handleBulkUnpublish = () => {
    console.log("bluk unpublishing");
    console.log(selectedBrands);
    selectedBrands.forEach(async (category) => {
      console.log("unublishing", category.slug);
      unpublishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} unpublished`);
    });
    setSelectedBrands([]);
  };
  const handleBulkDelete = () => {
    console.log("bluk deleting");
    console.log(selectedBrands);
    selectedBrands.forEach((category) => {
      console.log("deleting", category.slug);
      deleteMutate({ slug: category.slug });
      message.success(`${category.name} deleted`);
    });
    setSelectedBrands([]);
  };

  const handleBulkAction = (event) => {
    console.log(event);
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Categories",
          text: "Are you sure you want to publish selected categories?",
          type: "info",
          primaryButton: "Publish Selected",
          secondaryButton: "Cancel",
          image: "/publish-icon.svg",
          action: async () => handleBulkPublish(),
        });
        break;
      case "unpublish":
        setAlert({
          show: true,
          title: "Unpublish Selected Categories",
          text: "Are you sure you want to unpublish selected categories?",
          type: "warning",
          primaryButton: "Unpublish Selected",
          secondaryButton: "Cancel",
          image: "/unpublish-icon.svg",
          action: async () => handleBulkUnpublish(),
        });
        break;
      case "delete":
        setAlert({
          show: true,
          title: "Delete Selected Categories",
          text: "Are you sure you want to delete selected categories?",
          type: "danger",
          primaryButton: "Delete Selected",
          secondaryButton: "Cancel",
          image: "/delete-icon.svg",
          action: async () => handleBulkDelete(),
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      {alert.show && (
        <SimpleAlert
          title={alert.title}
          text={alert.text}
          type={alert.type}
          primaryButton={alert.primaryButton}
          secondaryButton={alert.secondaryButton}
          image={alert.image}
          action={alert.action}
          alert={alert}
          setAlert={setAlert}
          icon={alert.icon}
        />
      )}
      <div>
        <Header title="Brands" />
        {/* {isLoading && <div>Loading....</div>} */}
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div className="flex">
              <Select
                value={"Bulk Actions"}
                style={{
                  width: 120,
                  marginRight: "1rem",
                }}
                onChange={handleBulkAction}
              >
                <Option value="publish">Publish</Option>
                <Option value="unpublish">Unpublish</Option>
                <Option value="delete">Delete</Option>
              </Select>
              <AddCategoryButton linkText="Add Brand" linkTo="add" />
            </div>
          </div>
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {brands &&
              brands.map((brand, index) => (
                <CategoryWidget
                  key={brand.slug}
                  completeLink={`/brands/${brand.slug}`}
                  editLink={`/brands/edit/${brand.slug}`}
                  id={brand.sn}
                  image={brand.brand_image.medium_square_crop}
                  imgClassName=""
                  slug={brand.slug}
                  title={brand.name}
                  selectedCategories={selectedBrands}
                  setSelectedCategories={setSelectedBrands}
                />
              ))}
          </div>
          <Pagination
            hideOnSinglePage
            onChange={async (page) => paginate(page)}
            pageSize={10}
            total={data?.data?.data?.count}
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            style={{
              marginTop: "1rem",
              alignSelf: "end",
            }}
          />
        </div>
      </div>
      {brandSlug === "add" && <AddBrand alert={alert} setAlert={setAlert} />}
      {brandSlug === "edit" && (
        <EditBrand slug={slug} alert={alert} setAlert={setAlert} />
      )}
    </>
  );
}

export default BrandsScreen;
