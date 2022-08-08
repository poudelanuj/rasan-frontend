import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { Modal, Upload } from "antd";

import { addCategory } from "../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { GET_PAGINATED_CATEGORIES } from "../../../constants/queryKeys";

const { Dragger } = Upload;

function AddCategory({ isOpen, closeModal, setPaginatedCategoriesList }) {
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
  });
  const queryClient = useQueryClient();

  const handleAddCategory = useMutation(addCategory, {
    onSuccess: (data) => {
      setPaginatedCategoriesList([]);
      queryClient.invalidateQueries([GET_PAGINATED_CATEGORIES]);
      queryClient.refetchQueries([GET_PAGINATED_CATEGORIES]);
      openSuccessNotification(
        data.data.message || "Category created successfully"
      );
      closeModal();
    },
    onError: (data) => {
      openErrorNotification(data);
    },
  });

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
      handleAddCategory.mutate({ form_data });
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
    <Modal
      footer={false}
      title="Add New Category"
      visible={isOpen}
      onCancel={closeModal}
    >
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
              />
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
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
            type="button"
            onClick={async () => {
              await handleSave();
            }}
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddCategory;
