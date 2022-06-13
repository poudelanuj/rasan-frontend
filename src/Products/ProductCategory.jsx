import React from "react";
import CategoryWidget from "./CategoryWidget";

function ProductCategory({ categories }) {
  return (
    <>
      {categories.map((category) => (
        <CategoryWidget
          key={category.sn}
          completeLink={`/category-list/${category.slug}`}
          id={category.sn}
          image={category.category_image.thumbnail}
          slug={category.slug}
          title={category.name}
        />
      ))}
    </>
  );
}

export default ProductCategory;
