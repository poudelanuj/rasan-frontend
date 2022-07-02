import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

import { addBrand } from "../../context/CategoryContext";
import { useMutation, useQueryClient } from "react-query";

import { Upload } from "antd";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
const { Dragger } = Upload;

function AddBrand() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
  });
  const queryClient = useQueryClient();

  const { mutate: addBrandMutate, isLoading: addBrandIsLoading } = useMutation(
    addBrand,
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.data.message || "Brand created successfully"
        );
        queryClient.invalidateQueries("get-brands");
        navigate(`/brands/edit/` + data.data.data.slug);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );
  const closeAddBrands = () => {
    navigate("/brands");
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
        form_data.append("brand_image", formState.imageFile);
      }
      addBrandMutate({ form_data });
    } else {
      openErrorNotification({
        response: { data: { message: "Please fill all the fields" } },
      });
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

  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen z-[99990]"
        onClick={() => closeAddBrands()}
      ></div>
      <div className="min-w-[36.25rem] min-h-[33.5rem] fixed z-[99999] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col p-8 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <h2 className="text-3xl mb-3 text-[#192638] text-[2rem] font-medium">
          Add Brand
        </h2>
        {addBrandIsLoading && (
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
                Brand Name
              </label>
              <input
                className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]"
                id="name"
                placeholder="Eg. Hulas"
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
                  Brand Name (In Nepali)
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
                placeholder="Eg. हुलास"
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
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddBrand;
