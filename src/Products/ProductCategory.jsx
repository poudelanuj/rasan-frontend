import React from "react";
import CategoryWidget from "./CategoryWidget";

function ProductCategory({
  categories,
  selectedCategories,
  setSelectedCategories,
}) {
  // console.log(categories);
  return (
    <>
      {categories.map((category, index) => (
        <CategoryWidget
          key={index}
          completeLink={`/category-list/${category.slug}`}
          editLink={`/category-list/edit/${category.slug}`}
          id={category.sn}
          image={
            category.category_image.full_size ||
            category.category_image.medium_square_crop ||
            category.category_image.small_square_crop ||
            category.category_image.thumbnail ||
            "https://fisnikde.com/wp-content/uploads/2019/01/broken-image.png"
          }
          slug={category.slug}
          title={category.name}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      ))}
    </>
  );
}

export default ProductCategory;
