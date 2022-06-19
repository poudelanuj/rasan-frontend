import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductCategory from "./ProductCategory";

import AddCategory from "./CategoryList/AddCategory";
import EditCategory from "./CategoryList/EditCategory";
import SimpleAlert from "./alerts/SimpleAlert";

import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  deleteCategory,
  getCategories,
  publishCategory,
  unpublishCategory,
} from "../context/CategoryContext";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import SearchBox from "./subComponents/SearchBox";
import Header from "./subComponents/Header";

import { message, Pagination, Select } from "antd";
const { Option } = Select;

const CategoryList = () => {
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
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["get-categories", currentPage],
    () => getCategories({ currentPage })
  );
  const { mutate: publishCategoryMutate } = useMutation(publishCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-categories");
    },
  });
  const { mutate: unpublishCategoryMutate } = useMutation(unpublishCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-categories");
    },
  });
  const { mutate: deleteMutate } = useMutation(deleteCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-categories");
    },
  });
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[2];
  } catch (error) {
    categorySlug = null;
  }
  const categories = data?.data?.data?.results;

  const paginate = async (page) => {
    setCurrentPage(page);
  };
  const handleBulkPublish = () => {
    selectedCategories.forEach(async (category) => {
      publishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} published`);
    });
    setSelectedCategories([]);
  };
  const handleBulkUnpublish = () => {
    selectedCategories.forEach(async (category) => {
      unpublishCategoryMutate({ slug: category.slug });
      message.success(`${category.name} unpublished`);
    });
    setSelectedCategories([]);
  };
  const handleBulkDelete = () => {
    selectedCategories.forEach((category) => {
      deleteMutate({ slug: category.slug });
      message.success(`${category.name} deleted`);
    });
    setSelectedCategories([]);
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
        <Header title="Category List" />
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Category..." />
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
              <AddCategoryButton linkText="Add Category" linkTo="add" />
            </div>
          </div>
          {isLoading && <div>Loading....</div>}
          {isError && <div>Error: {error.message}</div>}
          {categories && (
            <>
              <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
                <ProductCategory
                  categories={categories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>
              <Pagination
                pageSize={20}
                showTotal={(total) => `Total ${total} items`}
                style={{
                  marginTop: "1rem",
                  alignSelf: "end",
                }}
                total={data.data.data.count}
                hideOnSinglePage
                showQuickJumper
                onChange={async (page) => paginate(page)}
              />
            </>
          )}
        </div>
      </div>
      {categorySlug === "add" && (
        <AddCategory alert={alert} setAlert={setAlert} />
      )}
      {categorySlug === "edit" && (
        <EditCategory alert={alert} setAlert={setAlert} slug={slug} />
      )}
    </>
  );
};

export default CategoryList;
