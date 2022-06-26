import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteProductGroup,
  getProductGroup,
  publishProductGroup,
  unpublishProductGroup,
  updateProductGroup,
} from "../../context/CategoryContext";

import { message, Upload } from "antd";
const { Dragger } = Upload;

function EditProductGroup({ alert, setAlert }) {
  const location = useLocation();
  let slug;
  try {
    slug = location.pathname.split("/")[2];
  } catch (error) {
    slug = null;
  }
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
  });
  const queryClient = useQueryClient();

  const {
    data: productGroupData,
    isLoading: productGroupIsLoading,
    isError: productGroupIsError,
    error: productGroupError,
  } = useQuery(["get-product-group", slug], () => getProductGroup({ slug }), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setFormState({
        name: data.data.data.name,
        name_np: data.data.data.name_np,
        image: data.data.data.product_group_image.full_size,
        is_published: data.data.data.is_published,
      });
    },
  });

  const {
    mutate: publishProductGroupMutate,
    isLoading: publishProductGroupIsLoading,
  } = useMutation(publishProductGroup, {
    onSuccess: (data) => {
      message.success("Product Group Published");
      queryClient.invalidateQueries(["get-product-group", slug]);
    },
  });

  const {
    mutate: unpublishProductGroupMutate,
    isLoading: unpublishProductGroupIsLoading,
  } = useMutation(unpublishProductGroup, {
    onSuccess: (data) => {
      message.success("Product Group Unpublished");
      queryClient.invalidateQueries(["get-product-group", slug]);
    },
  });

  const {
    mutate: updateProductGroupMutate,
    isLoading: updateProductGroupIsLoading,
    data: updateProductGroupResponseData,
    isError: updateProductGroupIsError,
  } = useMutation(updateProductGroup, {
    onSuccess: (data) => {
      message.success("Product Group Updated Successfully");
      queryClient.invalidateQueries(["get-product-group", slug]);
    },
  });

  const {
    mutate: deleteProductGroupMutate,
    isLoading: deleteProductGroupIsLoading,
    data: deleteProductGroupResponseData,
    isError: deleteProductGroupIsError,
  } = useMutation(deleteProductGroup, {
    onSuccess: (data) => {
      message.success("Product Group Deleted");
      queryClient.invalidateQueries("get-product-groups");
      navigate("/product-groups");
    },
  });

  const closeProductGroupWidget = () => {
    navigate(`/product-groups/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
  const handleSave = async () => {
    if (formState.name && formState.image && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      if (formState.imageFile) {
        form_data.append("product_group_image", formState.imageFile);
      }
      updateProductGroupMutate({ slug, form_data });
      return updateProductGroupResponseData?.data.data.slug || true;
    } else {
      message.error("Please fill all the fields");
      return false;
    }
  };
  const handlePublish = async () => {
    const isSaved = await handleSave();
    if (isSaved) {
      publishProductGroupMutate({ slug });
    }
  };
  const handleDelete = async () => {
    deleteProductGroupMutate({ slug });
  };
  const handleUnpublish = async () => {
    unpublishProductGroupMutate({ slug });
  };

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
      <div
        className="fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen z-[99990]"
        onClick={() => closeProductGroupWidget()}
      ></div>
      <div className="min-w-[36.25rem] min-h-[33.5rem] fixed z-[99999] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col p-8 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <h2 className="text-3xl mb-3 text-[#192638] text-[2rem] font-medium">
          Edit Product Group
        </h2>
        {(updateProductGroupIsLoading ||
          publishProductGroupIsLoading ||
          productGroupIsLoading) && (
          <div className="absolute top-0 right-0 bg-black/25 w-full h-full flex flex-col items-center justify-center z-50 animate-popupopen">
            <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
            <span className="p-2 text-white">Loading...</span>
          </div>
        )}
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
                  src={formState.image ? formState.image : "/gallery-icon.svg"}
                />
              </p>
              <p className="ant-upload-text text-[13px]">
                <UploadOutlined style={{ verticalAlign: "middle" }} />
                <span> Click or drag file to this area to upload</span>
              </p>
            </Dragger>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="name">
                Product Group Name
              </label>
              <input
                className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                id="name"
                placeholder="Eg. Mother's Day Special"
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
                  Product Group Name (In Nepali)
                </label>
                <img
                  alt="nepali"
                  className="w-[0.8rem] ml-2"
                  src="/flag_nepal.svg"
                />
              </div>
              <input
                className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                id="name"
                placeholder="Eg. आमाको मुख हेर्ने दिन विशेष"
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
              className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors"
              type="button"
              onClick={async () =>
                showAlert({
                  title: "Are you sure to Delete?",
                  text: "This action cannot be undone",
                  primaryButton: "Delete",
                  secondaryButton: "Cancel",
                  type: "danger",
                  image: "/delete-icon.svg",
                  action: async () => {
                    await handleDelete();
                  },
                })
              }
            >
              Delete
            </button>
            {formState.is_published ? (
              <button
                className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors ml-[1rem]"
                type="button"
                onClick={async () =>
                  showAlert({
                    title: "Are you sure to Unpublish?",
                    text:
                      "Unpublishing will make this product group unavailable to users",
                    primaryButton: "Unpublish",
                    secondaryButton: "Cancel",
                    type: "warning",
                    image: "/unpublish-icon.svg",
                    action: async () => {
                      await handleUnpublish();
                      return closeProductGroupWidget();
                    },
                  })
                }
              >
                Unpublish Product Group
              </button>
            ) : (
              <button
                className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors ml-[1rem]"
                type="button"
                onClick={async () =>
                  showAlert({
                    title: "Are you sure to Publish?",
                    text:
                      "Publishing this category would save it and make it visible to the public!",
                    primaryButton: "Publish",
                    secondaryButton: "Cancel",
                    type: "info",
                    image: "/publish-icon.svg",
                    action: async () => {
                      await handlePublish();
                      return closeProductGroupWidget();
                    },
                  })
                }
              >
                Publish Product Group
              </button>
            )}
            ;
            <button
              className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
              type="button"
              onClick={async () => {
                await handleSave();
                return closeProductGroupWidget();
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProductGroup;
