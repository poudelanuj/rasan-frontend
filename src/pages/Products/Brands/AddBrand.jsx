import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { Form, Modal, Upload, Input } from "antd";
import { getPaginatedBrands } from "../../../api/brands";
import { isEmpty } from "lodash";
import { addBrand } from "../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { GET_PAGINATED_BRANDS } from "../../../constants/queryKeys";

const { Dragger } = Upload;

function AddBrand({ isOpen, closeModal, setPaginatedBrandsList }) {
  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
  });
  const queryClient = useQueryClient();

  const handleAddBrand = useMutation(addBrand, {
    onSuccess: (data) => {
      setPaginatedBrandsList([]);
      queryClient.invalidateQueries([GET_PAGINATED_BRANDS]);
      queryClient.refetchQueries([GET_PAGINATED_BRANDS]);
      openSuccessNotification(
        data.data.message || "Brand created successfully"
      );
      closeModal();
    },
    onError: (data) => {
      openErrorNotification(data);
    },
  });

  const handleSave = async () => {
    if (formState.name && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      if (formState.imageFile) {
        form_data.append("brand_image", formState.imageFile);
      }
      handleAddBrand.mutate({ form_data });
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
      title="Add New Brand"
      visible={isOpen}
      onCancel={closeModal}
    >
      <Form className="flex flex-col justify-between flex-1">
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
              { required: true, message: "Brand name is required" },
              {
                validator: async (_, value) => {
                  const data = await getPaginatedBrands(1, 1, value);

                  if (
                    !isEmpty(
                      data.results?.find(
                        (product) =>
                          product.name.toLowerCase() === value.toLowerCase()
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
                Brand Name
              </label>
              <Input
                className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                id="name"
                name="name"
                placeholder="Eg. Hulas"
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </div>
          </Form.Item>

          <Form.Item
            className="!mb-0"
            name="nepaliName"
            rules={[{ required: true, message: "Brand name is required" }]}
          >
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
              <Input
                className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                id="name"
                name="nepaliName"
                placeholder="Eg. हुलास"
                type="text"
                value={formState.name_np}
                onChange={(e) =>
                  setFormState({ ...formState, name_np: e.target.value })
                }
              />
            </div>
          </Form.Item>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors"
            type="submit"
            onClick={async (e) => await handleSave(e)}
          >
            Create
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddBrand;
