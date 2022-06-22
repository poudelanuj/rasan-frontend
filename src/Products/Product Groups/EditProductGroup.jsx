import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  createProductGroup,
  getProductGroup,
  publishProductGroup,
} from "../../context/CategoryContext";
import { useMutation, useQueryClient } from "react-query";

import { message, Upload } from "antd";
const { Dragger } = Upload;

function EditProductGroup({ alert, setAlert }) {
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
  } = useQuery("get-product-group", () => getProductGroup(), {
    onSuccess: (data) => {
      setFormState(data.data.data);
    },
  });

  const {
    mutate: addProductGroupMutate,
    isLoading: addProductGroupIsLoading,
    data: addProductGroupResponseData,
  } = useMutation(createProductGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-product-groups");
    },
    onError: (data) => {},
  });

  const {
    mutate: publishProductGroupMutate,
    isLoading: publishProductGroupIsLoading,
  } = useMutation(publishProductGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-product-groups");
    },
  });

  const closeProductGroupWidget = () => {
    navigate("/product-groups");
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
      form_data.append("product_group_image", formState.imageFile);
      addProductGroupMutate({ form_data });
      message.success("Product Group created successfully");
      return addProductGroupResponseData?.data.data.slug;
    } else {
      message.error("Please fill all the fields");
      return false;
    }
  };
  const handlePublish = async () => {
    const isSaved = await handleSave();
    if (isSaved) {
      //   publishProductGroup({ isSaved });
      message.success("Category published successfully");
    }
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
          Add Product Group
        </h2>
        {(addProductGroupIsLoading || publishProductGroupIsLoading) && (
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
              onClick={async () => {
                await handleSave();
                return closeProductGroupWidget();
              }}
            >
              Create
            </button>
            <button
              className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
              type="button"
              onClick={async () =>
                showAlert({
                  title: "Are you sure to Publish?",
                  text: "Publishing this category would save it and make it visible to the public!",
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
              Publish Category
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProductGroup;
