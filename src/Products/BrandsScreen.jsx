import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getBrands } from "../context/CategoryContext";
import AddCategory from "./AddCategory";
import CategoryWidget from "./CategoryWidget";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import Header from "./subComponents/Header";
import SearchBox from "./subComponents/SearchBox";

function BrandsScreen() {
  const { data } = useQuery("get-brands", getBrands);
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
      <div>
        <Header title="Brands" />
        {/* {isLoading && <div>Loading....</div>} */}
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div>
              <AddCategoryButton linkText="Add Brand" linkTo="add" />
            </div>
          </div>
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {brands &&
              brands.map((brand, index) => (
                <CategoryWidget
                  key={brand.sn}
                  completeLink={`/brands/${brand.slug}`}
                  id={brand.sn}
                  image={brand.brand_image.medium_square_crop}
                  imgClassName=""
                  slug={brand.slug}
                  title={brand.name}
                />
              ))}
          </div>
        </div>
      </div>
      {brandSlug && <AddCategory />}
    </>
  );
}

export default BrandsScreen;
