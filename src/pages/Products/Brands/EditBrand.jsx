import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Modal, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { getBrand } from "../../../api/brands";

import { updateBrand, deleteBrand } from "../../../context/CategoryContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import Alert from "../../../shared/Alert";
import { ALERT_TYPE } from "../../../constants";
import {
  GET_PAGINATED_BRANDS,
  GET_SINGLE_BRAND,
} from "../../../constants/queryKeys";

const { Dragger } = Upload;

function EditBrand({ slug, isOpen, closeModal, setPaginatedBrandsList }) {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    is_published: false,
    imageFile: null,
  });
  const { data, status: brandStatus } = useQuery(
    [GET_SINGLE_BRAND, slug],
    () => getBrand(slug),
    {
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
    }
  );

  const handleBrandDelete = useMutation(() => deleteBrand({ slug }), {
    onSuccess: (data) => {
      openSuccessNotification(
        data.data.message || "Brand deleted successfully"
      );
      setPaginatedBrandsList([]);
      queryClient.invalidateQueries([GET_PAGINATED_BRANDS]);
      queryClient.invalidateQueries([[GET_SINGLE_BRAND, slug]]);
      queryClient.refetchQueries([GET_PAGINATED_BRANDS]);
      closeModal();
    },
    onError: (data) => {
      openErrorNotification(data);
    },
  });

  const handleBrandUpdate = useMutation(
    ({ slug, form_data }) => updateBrand({ slug, form_data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.data.message || "Brand updated successfully"
        );
        setPaginatedBrandsList([]);
        queryClient.invalidateQueries([GET_PAGINATED_BRANDS]);
        queryClient.invalidateQueries([[GET_SINGLE_BRAND, slug]]);
        queryClient.refetchQueries([GET_PAGINATED_BRANDS]);
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
        form_data.append("brand_image", formState.imageFile);
      }
      handleBrandUpdate.mutate({ slug, form_data });
    } else {
      openErrorNotification({
        response: { data: { message: "Please fill all the fields" } },
      });
    }
  };

  return (
    <>
      <Alert
        action={() => handleBrandDelete.mutate()}
        alertType={ALERT_TYPE.delete}
        closeModal={() => setOpenDeleteAlert(false)}
        isOpen={openDeleteAlert}
        status={handleBrandDelete.status}
        text="Are you sure you want to delete this category?"
        title="Delete Category"
      />

      <Modal
        footer={false}
        title="Edit Brand"
        visible={isOpen}
        onCancel={closeModal}
      >
        {brandStatus === "loading" && (
          <div className="my-4 mb-8 flex justify-center">
            <Spin size="large" />
          </div>
        )}

        {data && (
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
                      data.brand_image.full_size ||
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
            <div className="flex justify-end mt-4">
              <button
                className="text-white bg-[#C63617] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-  [#C63617] hover:bg-[#ad2f13] transition-colors"
                type="button"
                onClick={() => setOpenDeleteAlert(true)}
              >
                Delete Brand
              </button>

              <button
                className={`${
                  data?.is_published
                    ? "bg-[#00B0C2] text-white border-[#00B0C2] hover:bg-[#0091a1] "
                    : "text-[#00B0C2] bg-white border-[#00B0C2] hover:bg-[#effdff] "
                }
                    p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] transition-colors ml-5`}
                disabled={handleBrandUpdate.status === "loading"}
                type="button"
                onClick={async (e) => {
                  await handleSave(e);
                }}
              >
                {handleBrandUpdate.status === "loading" ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

export default EditBrand;
