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

  const { mutate: publishCategoryMutate } = useMutation(publishBrand, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-brands");
    },
  });
  const { mutate: unpublishCategoryMutate } = useMutation(unpublishBrand, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-brands");
    },
  });
  const { mutate: deleteMutate } = useMutation(deleteBrand, {
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
    setCurrentPage(page);
  };

  const brands = data?.data?.data?.results;

  const handleBulkPublish = () => {
    selectedBrands.forEach(async (category) => {
      publishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} published`);
    });
    setSelectedBrands([]);
  };
  const handleBulkUnpublish = () => {
    selectedBrands.forEach(async (category) => {
      unpublishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} unpublished`);
    });
    setSelectedBrands([]);
  };
  const handleBulkDelete = () => {
    selectedBrands.forEach((category) => {
      deleteMutate({ slug: category.slug });
      message.success(`${category.name} deleted`);
    });
    setSelectedBrands([]);
  };

  const handleBulkAction = (event) => {
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
      <div>
        <Header title="Brands" />
        {/* {isLoading && <div>Loading....</div>} */}
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div className="flex">
              <Select
                style={{
                  width: 120,
                  marginRight: "1rem",
                }}
                value={"Bulk Actions"}
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
                  selectedCategories={selectedBrands}
                  setSelectedCategories={setSelectedBrands}
                  slug={brand.slug}
                  title={brand.name}
                />
              ))}
          </div>
          <Pagination
            pageSize={10}
            showTotal={(total) => `Total ${total} items`}
            style={{
              marginTop: "1rem",
              alignSelf: "end",
            }}
            total={data?.data?.data?.count}
            hideOnSinglePage
            showQuickJumper
            onChange={async (page) => paginate(page)}
          />
        </div>
      </div>
      {brandSlug === "add" && <AddBrand alert={alert} setAlert={setAlert} />}
      {brandSlug === "edit" && (
        <EditBrand alert={alert} setAlert={setAlert} slug={slug} />
      )}
    </>
  );
}

export default BrandsScreen;
