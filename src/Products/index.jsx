import React from "react";
import { useLocation } from "react-router-dom";
import ProductCategory from "./ProductCategory";

import AddCategory from "./AddCategory";

import { useQuery } from "react-query";
import { getCategories } from "../context/CategoryContext";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import SearchBox from "./subComponents/SearchBox";
import Header from "./subComponents/Header";

const CategoryList = () => {
  const { data, isLoading, isError, error } = useQuery(
    "get-categories",
    getCategories
  );
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[2];
  } catch (error) {
    categorySlug = null;
  }
  const categories = data?.data?.data?.results;
  return (
    <>
      <div>
        <Header title="Category List" />
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Category..." />
            <div>
              <AddCategoryButton linkText="Add Category" linkTo="add" />
            </div>
          </div>
          {isLoading && <div>Loading....</div>}
          {isError && <div>Error: {error.message}</div>}
          {categories && (
            <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
              <ProductCategory categories={categories} />
            </div>
          )}
        </div>
      </div>
      {categorySlug && <AddCategory />}
    </>
  );
};

export default CategoryList;
