import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProductGroup } from "../../context/CategoryContext";
import { getDate, parseSlug } from "../../utility";
import SimpleAlert from "../alerts/SimpleAlert";
import EditProductGroup from "./EditProductGroup";

function ViewProductGroup() {
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
  const { slug } = useParams();
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[3];
  } catch (error) {
    categorySlug = null;
  }
  const [productGroup, setProductGroup] = useState({
    sn: "",
    name: "",
    slug: "",
    name_np: "",
    is_published: "",
    is_featured: "",
    product_group_image: "",
  });
  const {
    data: productGroupData,
    isLoading: getProductGroupIsLoading,
    isError: getProductGroupIsError,
    error: getProductGroupError,
  } = useQuery(["get-product-group", slug], () => getProductGroup({ slug }), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setProductGroup(data.data.data);
    },
  });
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
      {categorySlug === "edit" && (
        <EditProductGroup alert={alert} setAlert={setAlert} />
      )}
      {getProductGroupIsLoading && <div>Loading....</div>}
      {getProductGroupIsError && (
        <div>Error: {getProductGroupError.message}</div>
      )}
      {productGroupData && (
        <>
          <div className="text-3xl bg-white p-5 mb-7">{productGroup.name}</div>
          <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[70vh] max-w-[70%]">
            <div>
              <div className="flex justify-start relative">
                <div className="w-[100px] h-[150px]">
                  <img
                    src={productGroup?.product_group_image?.full_size}
                    alt="product"
                    className="w-[100%] h-[100%] object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center">
                  <p className="text-[#596579] text-[0.8rem]">Created at: </p>
                  <p className="text-[#596579] font-bold">
                    {productGroup.published_at
                      ? getDate(productGroup.published_at)
                      : "-"}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">
                    Last edited at:{" "}
                  </p>
                  <p className="text-[#596579] font-bold">
                    {productGroup.published_at
                      ? getDate(productGroup.published_at)
                      : "-"}
                  </p>
                  <p className="text-[#596579] text-[0.8rem]">Published at: </p>
                  <p className="text-[#596579] font-bold">
                    {productGroup.published_at
                      ? getDate(productGroup.published_at)
                      : "-"}
                  </p>
                </div>
                <div className="absolute top-0 right-0">
                  <Link
                    to={"edit"}
                    className="text-[#00A0B0] hover:bg-[#d4e4e6] py-2 px-6"
                  >
                    <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                    Details
                  </Link>
                </div>
              </div>
              <div className="mt-[1rem]">
                <div className="flex justify-start items-center">
                  <h3 className="text-xl text-[#374253]">
                    Product Group Details
                  </h3>
                  {productGroup.is_published ? (
                    <p className="ml-[6rem] rounded-full bg-[#E4FEEF] text-[#0E9E49] px-[1rem] py-[2px]">
                      Published
                    </p>
                  ) : (
                    <p className="ml-[6rem] rounded-full bg-[#FFF8E1] text-[#FF8F00] px-[1rem] py-[2px]">
                      Unpublished
                    </p>
                  )}
                </div>
                <div className="mt-[0.5rem] flex">
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1">
                    <p className="text-[#596579] text-[0.8rem]">Sno.</p>
                    <p className="text-[#596579] font-bold">
                      {productGroup.sn}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Product Group Name
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productGroup.name}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">
                      Name In Nepali
                    </p>
                    <p className="text-[#596579] font-bold">
                      {productGroup.name_np}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Slug</p>
                    <p className="text-[#596579] font-bold">
                      {productGroup.slug}
                    </p>

                    <p className="text-[#596579] text-[0.8rem]">Featured</p>
                    <p className="text-[#596579] font-bold">
                      {productGroup.is_featured ? "Featured" : "Not Featured"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 ml-5 gap-y-0 gap-x-5 items-center flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewProductGroup;
