import React from "react";
import { DEFAULT_CARD_IMAGE } from "../../constants";
import CategoryWidget from "./CategoryWidget";

function ProductCategory({
  categories,
  selectedCategories,
  setSelectedCategories,
}) {
  return (
    <>
      {categories.map((category, index) => (
        <CategoryWidget
          key={category.slug}
          completeLink={`/category-list/${category.slug}`}
          editLink={`/category-list/edit/${category.slug}`}
          id={category.sn}
          image={
            category.category_image.full_size ||
            category.category_image.medium_square_crop ||
            category.category_image.small_square_crop ||
            category.category_image.thumbnail ||
            DEFAULT_CARD_IMAGE
          }
          is_published={category.is_published}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          slug={category.slug}
          title={category.name}
        />
      ))}
    </>
  );
}

export default ProductCategory;
