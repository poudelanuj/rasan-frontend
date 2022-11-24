import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { Form, Input, Modal, Switch, Upload, Button } from "antd";
import { isEmpty } from "lodash";
import { getPaginatedProductGroups } from "../../../api/products/productGroups";
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

  const [form] = Form.useForm();

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
        response: { data: { errors: { message: "Please fill all fields" } } },
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
      <Form
        className="flex flex-col justify-between flex-1"
        form={form}
        onFinish={() => form.validateFields().then(() => handleSave())}
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
          <Form.Item
            className="!mb-0"
            name="name"
            rules={[
              { required: true, message: "Product name is required" },
              {
                validator: async (_, value) => {
                  const data = await getPaginatedProductGroups(1, 1, value);

                  if (
                    !isEmpty(
                      data.results?.find(
                        (product) =>
                          product.name.toLowerCase() === value?.toLowerCase()
                      )
                    )
                  )
                    return Promise.reject(`${value} already exist`);

                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="name">
                Rasan Choice Name *
              </label>
              <Input
                className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                id="name"
                name="name"
                placeholder="Eg. Mother's Day Special"
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </div>
          </Form.Item>

          <Form.Item
            className={"!mb-0"}
            name={"name_np"}
            rules={[{ required: true, message: "Product name is required" }]}
          >
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
              <Input
                className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                id="name"
                name={"name_np"}
                placeholder="Eg. आमाको मुख हेर्ने दिन विशेष"
                type="text"
                value={formState.name_np}
                onChange={(e) =>
                  setFormState({ ...formState, name_np: e.target.value })
                }
              />
            </div>
          </Form.Item>
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
          <Button htmlType="button" type="primary">
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddProductGroup;
