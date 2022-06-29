import React, { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProductGroups } from "../context/CategoryContext";
import SimpleAlert from "./alerts/SimpleAlert";
import CategoryWidget from "./CategoryWidget";
import AddProductGroup from "./Product Groups/AddProductGroup";
import EditProductGroup from "./Product Groups/EditProductGroup";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import ClearSelection from "./subComponents/ClearSelection";
import Header from "./subComponents/Header";
import SearchBox from "./subComponents/SearchBox";

function ProductGroupsScreen() {
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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { data, isLoading, isError, error } = useQuery(
    "get-product-groups",
    getProductGroups
  );
  const location = useLocation();
  let extraSlug;
  try {
    extraSlug = location.pathname.split("/")[2];
  } catch (error) {
    extraSlug = null;
  }

  const groups = data?.data?.data?.results;
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
      {extraSlug === "add" && (
        <AddProductGroup alert={alert} setAlert={setAlert} />
      )}
      <div>
        <Header title="Product Groups" />
        {/* {isLoading && <div>Loading....</div>} */}
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div className="flex">
              <ClearSelection
                selectedCategories={selectedProducts}
                setSelectedCategories={setSelectedProducts}
              />
              <AddCategoryButton linkText="Add Product Groups" linkTo="add" />
            </div>
          </div>
          {isLoading && <div>Loading....</div>}
          {isError && <div>Error: {error.message}</div>}
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {groups &&
              groups.map((group, index) => (
                <CategoryWidget
                  key={group.slug}
                  completeLink={`/product-groups/${group.slug}`}
                  editLink={`/product-groups/${group.slug}/edit`}
                  id={group.slug}
                  image={group.product_group_image.medium_square_crop}
                  imgClassName=""
                  slug={group.slug}
                  title={group.name}
                  selectedCategories={selectedProducts}
                  setSelectedCategories={setSelectedProducts}
                />
              ))}
          </div>
        </div>
      </div>
      {/* {
      brandSlug && (
        <AddCategory />
      )
    } */}
    </>
  );
}

export default ProductGroupsScreen;
