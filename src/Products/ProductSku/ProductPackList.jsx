import React from "react";
import { useState } from "react";
import { getProductPack } from "../../context/CategoryContext";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

function ProductPackList({ id }) {
  const [productPack, setProductPack] = useState({
    sn: 2,
    number_of_items: 10,
    price_per_piece: "2450.00",
    mrp_per_piece: "3100.00",
    product_sku: "taleju-sonam-rice-25-kg",
    is_published: true,
    published_at: "2022-06-09T17:11:37.272564Z",
    id: 5,
  });
  const {
    data: getProductPackData,
    isLoading: getProductPackIsLoading,
    isError: getProductPackIsError,
    error: getProductPackError,
  } = useQuery(["get-product-pack", id], () => getProductPack({ id }), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setProductPack(data.data.data);
    },
  });
  return (
    <div className="mt-[1rem] relative">
      <div className="flex justify-start items-center">
        <h3 className="text-xl text-[#374253]">Product Pack</h3>
        {productPack.is_published ? (
          <p className="ml-[6rem] rounded-full bg-[#E4FEEF] text-[#0E9E49] px-[1rem] py-[2px]">
            Published
          </p>
        ) : (
          <p className="ml-[6rem] rounded-full bg-[#FFF8E1] text-[#FF8F00] px-[1rem] py-[2px]">
            Unpublished
          </p>
        )}
      </div>
      <div className="absolute top-0 right-0">
        <Link
          className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
          to={
            id != null
              ? `edit-product-pack/${productPack.id}`
              : "add-product-pack"
          }
        >
          <EditOutlined style={{ verticalAlign: "middle" }} /> Edit Details
        </Link>
      </div>
      <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center w-[50%] mt-[0.5rem]">
        <p className="text-[#596579] text-[0.8rem]">S.N.</p>
        <p className="text-[#596579] font-bold">{productPack.sn}</p>

        <p className="text-[#596579] text-[0.8rem]">No. of items</p>
        <p className="text-[#596579] font-bold">
          {productPack.number_of_items}
        </p>

        <p className="text-[#596579] text-[0.8rem]">Price/Piece</p>
        <p className="text-[#596579] font-bold">
          {productPack.price_per_piece}
        </p>

        <p className="text-[#596579] text-[0.8rem]">MRP/Piece</p>
        <p className="text-[#596579] font-bold">{productPack.mrp_per_piece}</p>
      </div>
    </div>
  );
}

export default ProductPackList;
