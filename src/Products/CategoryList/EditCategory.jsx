import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateCategory,
  getCategory,
  publishCategory,
  deleteCategory,
  unpublishCategory,
} from "../../context/CategoryContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { parseSlug } from "../../utility";

import { message, Upload } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

function EditCategory({ slug, alert, setAlert }) {
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    is_published: false,
    imageFile: null,
  });
  const {
    data: categoryData,
    isLoading: getCategoryIsLoading,
    isError: getCategoryIsError,
    error: getCategoryError,
  } = useQuery(["get-category", slug], () => getCategory({ slug }), {
    onSuccess: (data) => {
      setFormState({
        ...formState,
        name: data.data.data.name,
        name_np: data.data.data.name_np,
        is_published: data.data.data.is_published,
      });
    },
    onError: (data) => {
      message.error(
        data.response.data.errors.detail ||
          data.response.data.errors.message ||
          data.message ||
          "Error fetching Category"
      );
    },
  });
  const { mutate: deleteMutate, isLoading: deleteCategoryIsLoading } =
    useMutation(() => deleteCategory({ slug }), {
      onSuccess: (data) => {
        message.success(data.data.message || "Category deleted successfully");
        queryClient.invalidateQueries("get-categories");
      },
      onError: (data) => {
        message.error(
          data.response.data.errors.detail ||
            data.response.data.errors.message ||
            data.message ||
            "Error deleting Category"
        );
      },
    });
  const { mutate: updateMutate, isLoading: updateCategoryIsLoading } =
    useMutation(({ slug, form_data }) => updateCategory({ slug, form_data }), {
      onSuccess: (data) => {
        message.success(data.data.message || "Category updated successfully");
        queryClient.invalidateQueries("get-categories");
        queryClient.invalidateQueries(["get-category", slug]);
        navigate(`/category-list/edit/${data.data.data.slug}`);
      },
      onError: (data) => {
        message.error(
          data.response.data.errors.detail ||
            data.response.data.errors.message ||
            data.message ||
            "Error updating Category"
        );
      },
    });
  const { mutate: publishCategoryMutate, isLoading: publishCategoryIsLoading } =
    useMutation(publishCategory, {
      onSuccess: (data) => {
        message.success(data.data.message || "Category published successfully");
        queryClient.invalidateQueries("get-categories");
        queryClient.invalidateQueries(["get-category", slug]);
      },
      onError: (data) => {
        message.error(
          data.response.data.errors.detail ||
            data.response.data.errors.message ||
            data.message ||
            "Error publishing Category"
        );
      },
    });
  const { mutate: unpublishCategoryMutate } = useMutation(unpublishCategory, {
    onSuccess: (data) => {
      message.success(data.data.message || "Category unpublished successfully");
      queryClient.invalidateQueries("get-categories");
      queryClient.invalidateQueries(["get-category", slug]);
    },
    onError: (data) => {
      message.error(
        data.response.data.errors.detail ||
          data.response.data.errors.message ||
          data.message ||
          "Error unpublishing Category"
      );
    },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const props = {
    maxCount: 1,
    multiple: false,
    beforeUpload: () => false,
    showUploadList: false,

    onChange: (filename) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (filename.file) {
          setFormState({
            ...formState,
            image: e.target.result,
            imageFile: filename.file,
          });
        }
      };
      reader.readAsDataURL(filename.file);
    },
  };

  const closeEditCategories = () => {
    navigate("/category-list");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
  const handleSave = async () => {
    if (formState.name && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      if (formState.imageFile) {
        form_data.append("category_image", formState.imageFile);
      }
      updateMutate({ slug, form_data });
    } else {
      message.error("Please fill all the fields!");
    }
  };
  const handlePublish = async ({ slug }) => {
    publishCategoryMutate({ slug });
  };
  const handleUnpublish = async ({ slug }) => {
    unpublishCategoryMutate({ slug });
  };
  const handleDelete = async ({ slug }) => {
    deleteMutate({ slug });
    closeEditCategories();
  };
  const showAlert = ({
    title,
    text,
    primaryButton,
    secondaryButton,
    type,
    image,
    action,
  }) => {
    setAlert({
      show: true,
      title,
      text,
      primaryButton,
      secondaryButton,
      type,
      image,
      action,
    });
  };

  return (
    <>
      {getCategoryIsError && getCategoryError.message}
      <div
        className="fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen"
        onClick={() => closeEditCategories()}
      ></div>
      {(getCategoryIsLoading ||
        updateCategoryIsLoading ||
        publishCategoryIsLoading ||
        deleteCategoryIsLoading) && (
        <div className="absolute top-0 right-0 bg-black/25 w-full h-full flex flex-col items-center justify-center z-50 animate-popupopen">
          <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
          <span className="p-2 text-white">
            {getCategoryIsLoading && "Getting category..."}
            {deleteCategoryIsLoading && "Deleting..."}
            {publishCategoryIsLoading && "Publishing..."}
            {updateCategoryIsLoading && "Updating..."}
          </span>
        </div>
      )}
      {categoryData?.data?.data && (
        <div className="min-w-[36.25rem] min-h-[33.5rem] fixed z-[1] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col p-8 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <h2 className="text-3xl mb-3 text-[#192638] text-[2rem] font-medium capitalize">
            {"Edit " + parseSlug(slug) + " - Category"}
          </h2>
          <form
            className="flex flex-col justify-between flex-1"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-[1rem] grid-cols-[100%]">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <img
                    alt="gallery"
                    className="h-[6rem] mx-auto"
                    src={
                      formState.image ||
                      categoryData?.data.data.category_image.full_size ||
                      "/gallery-icon.svg"
                    }
                  />
                </p>
                <p className="ant-upload-text text-[13px]">
                  <UploadOutlined style={{ verticalAlign: "middle" }} />
                  <span> Click or drag file to this area to upload</span>
                </p>
              </Dragger>
              <div className="flex flex-col">
                <label className="mb-1" htmlFor="name">
                  Category Name *
                </label>
                <input
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  id="name"
                  placeholder="Eg. Rice"
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  <label className="mb-1" htmlFor="name">
                    Category Name (In Nepali)
                  </label>
                  <img
                    alt="nepali"
                    className="w-[0.8rem] ml-2"
                    src="/flag_nepal.svg"
                  />{" "}
                  *
                </div>
                <input
                  className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                  id="name"
                  placeholder="Eg. चामल"
                  type="text"
                  value={formState.name_np}
                  onChange={(e) =>
                    setFormState({ ...formState, name_np: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="text-white bg-[#C63617] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-  [#C63617] hover:bg-[#ad2f13] transition-colors"
                type="button"
                onClick={() =>
                  showAlert({
                    title: "Are you sure to delete?",
                    text: "Remeber, this action cannot be undone!",
                    primaryButton: "Delete",
                    secondaryButton: "Cancel",
                    type: "danger",
                    image: "/delete-icon.svg",
                    action: async () => await handleDelete({ slug }),
                  })
                }
              >
                Delete
              </button>
              {categoryData?.data?.data?.is_published ? (
                <button
                  className="bg-[#FFF8E1] text-[#FF8F00] p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px]   border-[#FFF8E1] hover:bg-[#f4eaca] transition-colors"
                  type="button"
                  onClick={() =>
                    showAlert({
                      title: "Are you sure to Unpublish?",
                      text: "Unpublishing this category would make it invisible to the public!",
                      primaryButton: "Unpublish",
                      secondaryButton: "Cancel",
                      type: "warning",
                      image: "/unpublish-icon.svg",
                      action: async () => await handleUnpublish({ slug }),
                    })
                  }
                >
                  Unpublish Category
                </button>
              ) : (
                <button
                  className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px]   border-[#00B0C2] hover:bg-[#12919f] transition-colors"
                  type="button"
                  onClick={() =>
                    showAlert({
                      title: "Are you sure to Publish?",
                      text: "Publishing this category would make it visible to the public!",
                      primaryButton: "Publish",
                      secondaryButton: "Cancel",
                      type: "info",
                      image: "/publish-icon.svg",
                      action: async () => await handlePublish({ slug }),
                    })
                  }
                >
                  Publish Category
                </button>
              )}
              <button
                className={`${
                  categoryData?.data?.data?.is_published
                    ? "bg-[#00B0C2] text-white border-[#00B0C2] hover:bg-[#0091a1] "
                    : "text-[#00B0C2] bg-white border-[#00B0C2] hover:bg-[#effdff] "
                }
                    p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] transition-colors ml-5`}
                type="button"
                onClick={async (e) => {
                  await handleSave(e);
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditCategory;
