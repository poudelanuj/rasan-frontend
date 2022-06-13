import React from "react";
import CategoryWidget from "./CategoryWidget";

function ProductCategory({ categories }) {
  return (
    <>
      {categories.map((category) => (
        <CategoryWidget
          image={category.category_image.thumbnail}
          title={category.name}
          slug={category.slug}
          id={category.sn}
          completeLink={`/category-list/${category.slug}`}
          key={category.sn}
        />
      ))}
    </>
  );
}

export default ProductCategory;
