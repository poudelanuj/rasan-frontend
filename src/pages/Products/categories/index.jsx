import React, { useEffect, useState } from "react";
import { Pagination, Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";

import Alert from "../../../shared/Alert";

import SearchBox from "../subComponents/SearchBox";

import ClearSelection from "../subComponents/ClearSelection";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CategoryWidget from "./shared/CategoryWidget";
import { ALERT_TYPE, DEFAULT_RASAN_IMAGE } from "../../../constants";
import Loader from "../../../shared/Loader";
import {
  bulkDelete,
  bulkPublish,
  getPaginatedCategories,
} from "../../../api/categories";
import { GET_PAGINATED_CATEGORIES } from "../../../constants/queryKeys";
import { uniqBy } from "lodash";
import CustomPageHeader from "../../../shared/PageHeader";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const { Option } = Select;

const CategoryList = () => {
  const queryClient = useQueryClient();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(""); // * For Edit

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

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Categories Updated");
        setOpenAlert(false);
        setSelectedCategories([]);
        setCategories([]);
        queryClient.invalidateQueries([GET_PAGINATED_CATEGORIES]);
        queryClient.refetchQueries([GET_PAGINATED_CATEGORIES]);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleBulkDelete = useMutation((slugs) => bulkDelete(slugs), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Categories Deleted");
      setOpenAlert(false);
      setSelectedCategories([]);
      setCategories([]);
      queryClient.invalidateQueries([GET_PAGINATED_CATEGORIES]);
      queryClient.refetchQueries([GET_PAGINATED_CATEGORIES]);
    },
    onError: (error) => openErrorNotification(error),
  });

  const renderAlert = () => {
    switch (alertType) {
      case "publish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: true,
                slugs: selectedCategories.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.publish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to publish selected categories?"
            title="Publish Selected Categories"
          />
        );

      case "unpublish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: false,
                slugs: selectedCategories.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.unpublish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to unpublish selected categories?"
            title="Unpublish Selected Categories"
          />
        );
      case "delete":
        return (
          <Alert
            action={() =>
              handleBulkDelete.mutate(
                selectedCategories.map(({ slug }) => slug)
              )
            }
            alertType={ALERT_TYPE.delete}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkDelete.status}
            text="Are you sure you want to delete selected categories?"
            title="Delete Selected Categories"
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      {(status === "loading" || isRefetching) && <Loader isOpen />}

      {openAlert && renderAlert()}

      <CustomPageHeader title="Categories" isBasicHeader />

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
                onSelect={(value) => {
                  setOpenAlert(true);
                  setAlertType(value);
                }}
              >
                <Option value={ALERT_TYPE.publish}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="change_category"
                  >
                    Publish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.unpublish}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="change_category"
                  >
                    Unpublish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.delete}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="delete_category"
                  >
                    Delete
                  </ButtonWPermission>
                </Option>
              </Select>
            )}

            <ButtonWPermission
              codename="add_category"
              type="primary"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              Add New Category
            </ButtonWPermission>
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
                    editClick={() => {
                      setIsEditCategoryOpen(true);
                      setSelectedCategorySlug(category.slug);
                    }}
                    id={index + 1}
                    image={
                      category.category_image.thumbnail || DEFAULT_RASAN_IMAGE
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
      {isAddCategoryOpen && (
        <AddCategory
          closeModal={() => setIsAddCategoryOpen(false)}
          isOpen={isAddCategoryOpen}
          setPaginatedCategoriesList={setCategories}
        />
      )}

      {isEditCategoryOpen && (
        <EditCategory
          closeModal={() => setIsEditCategoryOpen(false)}
          isOpen={isEditCategoryOpen}
          setPaginatedCategoriesList={setCategories}
          slug={selectedCategorySlug}
        />
      )}
    </>
  );
};

export default CategoryList;
