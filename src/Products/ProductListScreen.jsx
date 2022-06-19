import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProducts } from "../context/CategoryContext";
import AddCategory from "./CategoryList/AddCategory";
import CategoryWidget from "./CategoryWidget";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import Header from "./subComponents/Header";
// import SearchBox from "./subComponents/SearchBox";

import TabAll from "./ProductList/TabAll";
import TabSKU from "./CategoryList/TabSKU";
import TabProductPackSize from "./ProductList/TabProductPackSize";

import { Tabs } from "antd";
const { TabPane } = Tabs;

const onChange = (key) => {};

function ProductListScreen() {
  const { data, isLoading, isError, error } = useQuery(
    "get-products",
    getProducts
  );
  const location = useLocation();
  let brandSlug;
  try {
    brandSlug = location.pathname.split("/")[2];
  } catch (error) {
    brandSlug = null;
  }
  const brands = data?.data?.data?.results;
  return (
    <>
      <>
        {isLoading && <div>Loading....</div>}
        {isError && <div>Error: {error.message}</div>}
        {data && (
          <div>
            <Header title="Products List" />
            {/* <Tabs defaultActiveKey="1" onChange={onChange}>
              <TabPane key="1" tab="All">
                <TabAll />
              </TabPane>
              <TabPane key="2" tab="SKU">
                <TabSKU />
              </TabPane>
              <TabPane key="3" tab="Product Drafts">
                <TabProductPackSize />
              </TabPane>
            </Tabs> */}
            <TabAll />
          </div>
        )}
      </>
    </>
  );
}

export default ProductListScreen;
