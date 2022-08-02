import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Pagination, Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";

import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import SimpleAlert from "../alerts/SimpleAlert";

import {
  deleteCategory,
  publishCategory,
  unpublishCategory,
} from "../../../context/CategoryContext";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import SearchBox from "../subComponents/SearchBox";
import Header from "../subComponents/Header";

import ClearSelection from "../subComponents/ClearSelection";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CategoryWidget from "./shared/CategoryWidget";
import { DEFAULT_CARD_IMAGE } from "../../../constants";
import Loader from "../../../shared/Loader";
import { getPaginatedCategories } from "../../../api/categories";
import { GET_PAGINATED_CATEGORIES } from "../../../constants/queryKeys";
import { uniqBy } from "lodash";

const { Option } = Select;

const CategoryList = () => {
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
  const { slug } = useParams();

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    data,
    status,
    refetch: refetchCategories,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_CATEGORIES, page.toString() + pageSize.toString()],
    () => getPaginatedCategories(page, pageSize)
  );

  useEffect(() => {
    if (data)
      setCategories((prev) => uniqBy([...prev, ...data.results], "slug"));
  }, [data]);

  useEffect(() => {
    refetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const { mutate: publishCategoryMutate } = useMutation(publishCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GET_PAGINATED_CATEGORIES);
      openSuccessNotification(
        data?.data?.message || "Category published successfully"
      );
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });
  const { mutate: unpublishCategoryMutate } = useMutation(unpublishCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GET_PAGINATED_CATEGORIES);
      openSuccessNotification(
        data?.data?.message || "Category unpublished successfully"
      );
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });
  const { mutate: deleteMutate } = useMutation(deleteCategory, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GET_PAGINATED_CATEGORIES);
      openSuccessNotification(
        data?.data?.message || "Category deleted successfully"
      );
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });
  const location = useLocation();
  let categorySlug;
  try {
    categorySlug = location.pathname.split("/")[2];
  } catch (error) {
    categorySlug = null;
  }

  const handleBulkPublish = () => {
    selectedCategories.forEach(async (category) => {
      publishCategoryMutate({ slug: category.slug });
    });
    setSelectedCategories([]);
  };
  const handleBulkUnpublish = () => {
    selectedCategories.forEach(async (category) => {
      unpublishCategoryMutate({ slug: category.slug });
    });
    setSelectedCategories([]);
  };
  const handleBulkDelete = () => {
    selectedCategories.forEach((category) => {
      deleteMutate({ slug: category.slug });
    });
    setSelectedCategories([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Categories",
          text: "Are you sure you want to publish selected categories?",
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
          title: "Unpublish Selected Categories",
          text: "Are you sure you want to unpublish selected categories?",
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
          title: "Delete Selected Categories",
          text: "Are you sure you want to delete selected categories?",
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
      {(status === "loading" || isRefetching) && <Loader isOpen />}

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
      <div>
        <Header title="Categories" />
        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Category..." />
            <div className="flex">
              <ClearSelection
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
              {selectedCategories.length > 0 && (
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
              <AddCategoryButton linkText="Add Category" linkTo="add" />
            </div>
          </div>
          {categories && (
            <>
              <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
                {categories
                  .filter((item, index) => {
                    const initPage = (page - 1) * pageSize;
                    const endPage = page * pageSize;
                    if (index >= initPage && index < endPage) return true;
                    return false;
                  })
                  .map((category, index) => (
                    <CategoryWidget
                      key={category.slug}
                      completeLink={`/category-list/${category.slug}`}
                      editLink={`/category-list/edit/${category.slug}`}
                      id={index + 1}
                      image={
                        category.category_image.thumbnail || DEFAULT_CARD_IMAGE
                      }
                      is_published={category.is_published}
                      selectedCategories={selectedCategories}
                      setSelectedCategories={setSelectedCategories}
                      slug={category.slug}
                      title={category.name}
                    />
                  ))}
              </div>
              <div className="flex justify-end bg-white w-full mt-10">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  showTotal={(total) => `Total ${total} items`}
                  total={data?.count}
                  onChange={(page, pageSize) => {
                    setPage(page);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {categorySlug === "add" && (
        <AddCategory alert={alert} setAlert={setAlert} />
      )}
      {categorySlug === "edit" && (
        <EditCategory alert={alert} setAlert={setAlert} slug={slug} />
      )}
    </>
  );
};

export default CategoryList;
