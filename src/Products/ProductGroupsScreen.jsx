import { message, Select } from "antd";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import {
  deleteProductGroup,
  getProductGroups,
  publishProductGroup,
  unpublishProductGroup,
} from "../context/CategoryContext";
import SimpleAlert from "./alerts/SimpleAlert";
import CategoryWidget from "./CategoryWidget";
import { noImageImage } from "./constants";
import AddProductGroup from "./Product Groups/AddProductGroup";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import ClearSelection from "./subComponents/ClearSelection";
import Header from "./subComponents/Header";
import Loader from "./subComponents/Loader";
import SearchBox from "./subComponents/SearchBox";

const { Option } = Select;

function ProductGroupsScreen() {
  // const [entriesPerPage, setEntriesPerPage] = useState(20);
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
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery(
    ["get-product-groups", currentPage],
    () => getProductGroups({ currentPage }),
    {
      onError: (err) => {
        message.error(
          err.response.data.errors.detail ||
            err.message ||
            "Error getting Product Groups"
        );
      },
    }
  );
  const location = useLocation();
  let extraSlug;
  try {
    extraSlug = location.pathname.split("/")[2];
  } catch (error) {
    extraSlug = null;
  }
  const paginate = async (page) => {
    setCurrentPage(page);
  };
  const { mutate: publishProductGroupMutate } = useMutation(
    publishProductGroup,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("get-product-groups");
        message.success(
          data?.data?.message || "Rasan Choice published successfully"
        );
      },
      onError: (err) => {
        message.error(
          err.response.data.errors.detail ||
            err.message ||
            "Error publishing Rasan Choice"
        );
      },
    }
  );
  const { mutate: unpublishProductGroupMutate } = useMutation(
    unpublishProductGroup,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("get-product-groups");
        message.success(
          data?.data?.message || "Rasan Choice unpublished successfully"
        );
      },
      onError: (err) => {
        message.error(
          err.response.data.errors.detail ||
            err.message ||
            "Error unpublishing Rasan Choice"
        );
      },
    }
  );
  const { mutate: deleteProductGroupMutate } = useMutation(deleteProductGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-product-groups");
      message.success(
        data?.data?.message || "Rasan Choice deleted successfully"
      );
    },
    onError: (err) => {
      message.error(
        err.response.data.errors.detail ||
          err.message ||
          "Error deleting Rasan Choice"
      );
    },
  });

  const groups = data?.data?.data?.results;

  const handleBulkPublish = () => {
    selectedProducts.forEach(async (product) => {
      publishProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };
  const handleBulkUnpublish = () => {
    selectedProducts.forEach(async (product) => {
      unpublishProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };
  const handleBulkDelete = () => {
    selectedProducts.forEach((product) => {
      deleteProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Rasan Choices?",
          text: "Are you sure you want to publish selected Rasan Choices?",
          type: "info",
          primaryButton: "Publish Selected",
          secondaryButton: "Cancel",
          image: "/publish-icon.svg",
          action: async () => handleBulkPublish(),
        });
        break;
      case "unpublish":
        setAlert({
          show: true,
          title: "Unpublish Selected Rasan Choices?",
          text: "Are you sure you want to unpublish selected Rasan Choices?",
          type: "warning",
          primaryButton: "Unpublish Selected",
          secondaryButton: "Cancel",
          image: "/unpublish-icon.svg",
          action: async () => handleBulkUnpublish(),
        });
        break;
      case "delete":
        setAlert({
          show: true,
          title: "Delete Selected Rasan Choices?",
          text: "Are you sure you want to delete selected Rasan Choices?",
          type: "danger",
          primaryButton: "Delete Selected",
          secondaryButton: "Cancel",
          image: "/delete-icon.svg",
          action: async () => handleBulkDelete(),
        });
        break;
      default:
        break;
    }
  };
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
        <Header title="Rasan Choices" />
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div className="flex">
              <ClearSelection
                selectedCategories={selectedProducts}
                setSelectedCategories={setSelectedProducts}
              />
              {selectedProducts.length > 0 && (
                <Select
                  style={{
                    width: 120,
                    marginRight: "1rem",
                  }}
                  value={"Bulk Actions"}
                  onChange={handleBulkAction}
                >
                  <Option value="publish">Publish</Option>
                  <Option value="unpublish">Unpublish</Option>
                  <Option value="delete">Delete</Option>
                </Select>
              )}
              <AddCategoryButton linkText="Add Rasan Choice" linkTo="add" />
            </div>
          </div>
          {isLoading && <Loader loadingText={"Loading Rasan Choices..."} />}
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {groups &&
              groups.map((group) => (
                <CategoryWidget
                  key={group.slug}
                  completeLink={`/product-groups/${group.slug}`}
                  editLink={`/product-groups/${group.slug}/edit`}
                  id={group.slug}
                  image={
                    group.product_group_image.full_size ||
                    group.product_group_image.medium_square_crop ||
                    group.product_group_image.small_square_crop ||
                    group.product_group_image.thumbnail ||
                    noImageImage
                  }
                  imgClassName=""
                  slug={group.slug}
                  title={group.name}
                  selectedCategories={selectedProducts}
                  setSelectedCategories={setSelectedProducts}
                  is_published={group.is_published}
                />
              ))}
          </div>
          {/* {groups && (
            <div className="flex justify-between bg-white w-[100%] mt-10">
              <div className="">
                <span className="text-sm text-gray-600">
                  Entries per page :{" "}
                </span>
                <Select
                  defaultValue="20"
                  style={{
                    width: 120,
                  }}
                  onChange={(value) => setEntriesPerPage(value)}
                >
                  <Option value={20}>20</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </div>
              <Pagination
                pageSize={entriesPerPage}
                showTotal={(total) => `Total ${total} items`}
                style={{
                  alignSelf: "end",
                }}
                total={data.data.data.count}
                // hideOnSinglePage
                showQuickJumper
                onChange={async (page) => await paginate(page)}
              />
            </div>
          )} */}
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
