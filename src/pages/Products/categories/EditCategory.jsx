import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, Modal, Spin, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { getCategory, getPaginatedCategories } from "../../../api/categories";

import {
  updateCategory,
  deleteCategory,
} from "../../../context/CategoryContext";

import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import Alert from "../../../shared/Alert";
import { ALERT_TYPE } from "../../../constants";
import {
  GET_PAGINATED_CATEGORIES,
  GET_SINGLE_CATEGORY,
} from "../../../constants/queryKeys";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

function EditCategory({ slug, isOpen, closeModal }) {
  const navigate = useNavigate();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    is_published: false,
    imageFile: null,
  });

  const [form] = Form.useForm();

  const { data: categoryData, status: categoryStatus } = useQuery({
    queryKey: [GET_SINGLE_CATEGORY, slug],
    queryFn: () => getCategory(slug),
    enabled: !!slug,
    onSuccess: (data) => {
      setFormState({
        ...formState,
        name: data.name,
        name_np: data.name_np,
        is_published: data.is_published,
      });
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const handleDeleteCategory = useMutation(() => deleteCategory({ slug }), {
    onSuccess: (data) => {
      openSuccessNotification(
        data.data.message || "Category deleted successfully"
      );

      navigate("/category-list");
      queryClient.invalidateQueries([GET_PAGINATED_CATEGORIES]);
      queryClient.invalidateQueries([GET_SINGLE_CATEGORY, slug]);
      queryClient.refetchQueries([GET_PAGINATED_CATEGORIES]);
      closeModal();
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const handleUpdateCategory = useMutation(
    ({ slug, form_data }) => updateCategory({ slug, form_data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.data.message || "Category updated successfully"
        );
        navigate("/category-list");
        queryClient.invalidateQueries([GET_PAGINATED_CATEGORIES]);
        queryClient.invalidateQueries([GET_SINGLE_CATEGORY, slug]);
        queryClient.refetchQueries([GET_PAGINATED_CATEGORIES]);
        closeModal();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

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

  const handleSave = async () => {
    if (formState.name && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      if (formState.imageFile) {
        form_data.append("category_image", formState.imageFile);
      }
      handleUpdateCategory.mutate({ slug, form_data });
    } else {
      openErrorNotification({
        response: {
          data: { errors: { detail: "Please fill all the fields" } },
        },
      });
    }
  };

  return (
    <>
      <Alert
        action={() => handleDeleteCategory.mutate()}
        alertType={ALERT_TYPE.delete}
        closeModal={() => setOpenDeleteAlert(false)}
        isOpen={openDeleteAlert}
        status={handleDeleteCategory.status}
        text="Are you sure you want to delete this category?"
        title="Delete Category"
      />

      <Modal
        footer={false}
        title="Edit Category"
        visible={isOpen}
        onCancel={closeModal}
      >
        {categoryStatus === "loading" && (
          <div className="my-4 mb-8 flex justify-center">
            <Spin size="large" />
          </div>
        )}
        {categoryData && (
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
                    src={
                      formState.image ||
                      categoryData.category_image.full_size ||
                      "/gallery-icon.svg"
                    }
                  />
                </p>
                <p className="ant-upload-text text-[13px]">
                  <UploadOutlined style={{ verticalAlign: "middle" }} />
                  <span> Click or drag file to this area to upload</span>
                </p>
              </Dragger>

              <Form.Item
                className="!mb-0"
                initialValue={formState?.name}
                name="name"
                rules={[
                  { required: true, message: "Category name is required" },
                  {
                    validator: async (_, value) => {
                      const data = await getPaginatedCategories(1, 1, value);

                      if (
                        value?.toLowerCase() !==
                        categoryData?.name.toLowerCase()
                      ) {
                        if (
                          !isEmpty(
                            data.results?.find(
                              (product) =>
                                product.name.toLowerCase() ===
                                value?.toLowerCase()
                            )
                          )
                        )
                          return Promise.reject(`${value} already exist`);
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <div className="flex flex-col">
                  <label className="mb-1" htmlFor="name">
                    Category Name *
                  </label>
                  <Input
                    className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                    id="name"
                    name="name"
                    placeholder="Eg. Rice"
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
                initialValue={formState?.name_np}
                name="name_np"
                rules={[
                  { required: true, message: "Category name is required" },
                ]}
              >
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
                  <Input
                    className="!bg-[#FFFFFF] !border-[1px] !border-[#D9D9D9] !rounded-[2px] !p-[8px_12px]"
                    id="name"
                    name="name_np"
                    placeholder="Eg. चामल"
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
                className="text-white bg-[#C63617] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-  [#C63617] hover:bg-[#ad2f13] transition-colors"
                type="button"
                onClick={() => setOpenDeleteAlert(true)}
              >
                Delete Category
              </button>

              <button
                className={`${
                  categoryData?.is_published
                    ? "bg-[#00B0C2] text-white border-[#00B0C2] hover:bg-[#0091a1] "
                    : "text-[#00B0C2] bg-white border-[#00B0C2] hover:bg-[#effdff] "
                }
                  p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] transition-colors ml-5`}
                disabled={handleUpdateCategory.status === "loading"}
                type="submit"
              >
                {handleUpdateCategory.status === "loading"
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}

export default EditCategory;
