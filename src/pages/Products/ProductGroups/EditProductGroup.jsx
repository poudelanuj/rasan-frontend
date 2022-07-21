import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Switch, Upload } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  deleteProductGroup,
  getProductGroup,
  updateProductGroup,
} from "../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

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
    is_featured: false,
  });
  const queryClient = useQueryClient();

  const { data: productGroupData, isLoading: productGroupIsLoading } = useQuery(
    ["get-product-group", slug],
    () => getProductGroup({ slug }),
    {
      onSuccess: (data) => {
        setFormState({
          ...formState,
          name: data.data.data.name,
          name_np: data.data.data.name_np,
          is_published: data.data.data.is_published,
          is_featured: data.data.data.is_featured,
        });
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const {
    mutate: updateProductGroupMutate,
    isLoading: updateProductGroupIsLoading,
  } = useMutation(updateProductGroup, {
    onSuccess: (data) => {
      openSuccessNotification(
        data.data.message || "Product Group Updated Successfully"
      );
      queryClient.invalidateQueries(["get-product-group", slug]);
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const {
    mutate: deleteProductGroupMutate,
    isLoading: deleteProductGroupIsLoading,
  } = useMutation(deleteProductGroup, {
    onSuccess: (data) => {
      openSuccessNotification(data.data.message || "Product Group Deleted");
      queryClient.invalidateQueries("get-product-groups");
      navigate("/product-groups");
    },
    onError: (err) => {
      openErrorNotification(err);
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
    if (formState.name && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      form_data.append("is_featured", formState.is_featured);
      if (formState.imageFile) {
        form_data.append("product_group_image", formState.imageFile);
      }
      updateProductGroupMutate({ slug, form_data });
    } else {
      openErrorNotification({
        response: { data: { message: "Please fill all the fields" } },
      });
    }
  };

  const handleDelete = async () => {
    deleteProductGroupMutate({ slug });
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
          Edit Rasan Choice
        </h2>
        {(updateProductGroupIsLoading ||
          deleteProductGroupIsLoading ||
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
                  src={
                    formState.image ||
                    productGroupData?.data.data.product_group_image.full_size ||
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
                Rasan Choice Name *
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
                  Rasan Choice Name (In Nepali)
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
                placeholder="Eg. आमाको मुख हेर्ने दिन विशेष"
                type="text"
                value={formState.name_np}
                onChange={(e) =>
                  setFormState({ ...formState, name_np: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Switch
              checked={formState.is_featured}
              checkedChildren="Featured"
              className={`px-1 ${
                formState.is_featured ? "bg-[#1890ff]" : "bg-[#bfbfbf]"
              }`}
              size="default"
              unCheckedChildren="Feature"
              defaultChecked
              onChange={(e) => setFormState({ ...formState, is_featured: e })}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="text-white bg-[#C63617] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-  [#C63617] hover:bg-[#ad2f13] transition-colors"
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

            <button
              className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
              type="button"
              onClick={async () => {
                await handleSave();
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
