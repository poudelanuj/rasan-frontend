import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { Modal, Switch, Upload } from "antd";

import { createProductGroup } from "../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const { Dragger } = Upload;

function AddProductGroup({ isOpen, closeModal, setProductGroupsList }) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
    is_featured: false,
  });
  const queryClient = useQueryClient();

  const handleAddProductGroups = useMutation(createProductGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-product-groups");
      openSuccessNotification(
        data?.data?.message || "Rasan Choice created successfully"
      );
      navigate(`/product-groups/${data?.data.data.slug}/edit`);
    },
    onError: (err) => {
      openErrorNotification(err);
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
      form_data.append("is_featured", formState.is_featured);
      if (formState.imageFile) {
        form_data.append("product_group_image", formState.imageFile);
      }
      handleAddProductGroups.mutate({ form_data });
    } else {
      openErrorNotification({
        response: { data: { message: "Please fill all fields" } },
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
      title="Add New Rasan Choice"
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
    </Modal>
  );
}

export default AddProductGroup;
