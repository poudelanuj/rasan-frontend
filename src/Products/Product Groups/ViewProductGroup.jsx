import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProductGroup } from "../../context/CategoryContext";
import Header from "../subComponents/Header";

function ViewProductGroup() {
  const { slug } = useParams();
  const {
    data: productGroupData,
    isLoading: productGroupIsLoading,
    isError: productGroupIsError,
    error: productGroupError,
  } = useQuery("get-product-group", () => getProductGroup({ slug }), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <>
      <Header title="Products SKUs" />
      <div className="w-[70%] min-h-[70vh] bg-white">Hello there</div>
    </>
  );
}

export default ViewProductGroup;
