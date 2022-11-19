import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Form, Input, Modal, Spin, Switch, Upload } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { isEmpty } from "lodash";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import Alert from "../../../shared/Alert";
import {
  GET_PAGINATED_PRODUCT_GROUPS,
  GET_SINGLE_PRODUCT_GROUP,
} from "../../../constants/queryKeys";
import { ALERT_TYPE } from "../../../constants";
import {
  deleteProductGroup,
  getProductGroup,
  getPaginatedProductGroups,
  updateProductGroup,
} from "../../../api/products/productGroups";

const { Dragger } = Upload;

function EditProductGroup({ slug, isOpen, closeModal, setProductGroupsList }) {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    name_np: "",
    image: "",
    imageFile: null,
    is_featured: false,
  });
  const queryClient = useQueryClient();

  const { data: productGroupData, status: productGroupStatus } = useQuery(
    [GET_SINGLE_PRODUCT_GROUP, slug],
    () => getProductGroup(slug),
    {
      onSuccess: (data) => {
        setFormState({
          ...formState,
          name: data.name,
          name_np: data.name_np,
          is_published: data.is_published,
          is_featured: data.is_featured,
        });
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const handleDeleteProductGroup = useMutation(
    () => deleteProductGroup({ slug }),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.data.message || "Rasan Choice deleted successfully"
        );
        if (setProductGroupsList) setProductGroupsList([]);
        queryClient.invalidateQueries([GET_PAGINATED_PRODUCT_GROUPS]);
        queryClient.invalidateQueries([[GET_SINGLE_PRODUCT_GROUP, slug]]);
        queryClient.refetchQueries([GET_PAGINATED_PRODUCT_GROUPS]);
        closeModal();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const handleUpdateProductGroup = useMutation(
    ({ slug, form_data }) => updateProductGroup({ slug, form_data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.data.message || "Category updated successfully"
        );
        if (setProductGroupsList) setProductGroupsList([]);
        queryClient.invalidateQueries([GET_PAGINATED_PRODUCT_GROUPS]);
        queryClient.invalidateQueries([[GET_SINGLE_PRODUCT_GROUP, slug]]);
        queryClient.refetchQueries([GET_PAGINATED_PRODUCT_GROUPS]);
        closeModal();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const handleSave = async () => {
    if (formState.name && formState.name_np) {
      let form_data = new FormData();
      form_data.append("name", formState.name);
      form_data.append("name_np", formState.name_np);
      form_data.append("is_featured", formState.is_featured);
      if (formState.imageFile) {
        form_data.append("product_group_image", formState.imageFile);
      }
      handleUpdateProductGroup.mutate({ slug, form_data });
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
      <Alert
        action={() => handleDeleteProductGroup.mutate()}
        alertType={ALERT_TYPE.delete}
        closeModal={() => setOpenDeleteAlert(false)}
        isOpen={openDeleteAlert}
        status={handleDeleteProductGroup.status}
        text="Are you sure you want to delete this rasan choice?"
        title="Delete Rasan Choice"
      />

      <Modal
        footer={false}
        title="Edit Rasan Choice"
        visible={isOpen}
        onCancel={closeModal}
      >
        {productGroupStatus === "loading" && (
          <div className="my-4 mb-8 flex justify-center">
            <Spin size="large" />
          </div>
        )}
        {productGroupData && (
          <Form className="flex flex-col justify-between flex-1">
            <div className="grid gap-[1rem] grid-cols-[100%]">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <img
                    alt="gallery"
                    className="h-[6rem] mx-auto"
                    src={
                      formState.image ||
                      productGroupData?.product_group_image.full_size ||
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
                name="name"
                rules={[
                  { required: true, message: "Product name is required" },
                  {
                    validator: async (_, value) => {
                      const data = await getPaginatedProductGroups(1, 1, value);

                      if (
                        productGroupData.name.toLowerCase() !==
                        value.toLowerCase()
                      ) {
                        if (
                          !isEmpty(
                            data.results?.find(
                              (product) =>
                                product.name.toLowerCase() ===
                                value.toLowerCase()
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
                name={"nepaliName"}
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
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
                    name="nepaliName"
                    placeholder="Eg. आमाको मुख हेर्ने दिन विशेष"
                    type="text"
                    value={formState.name_np}
                    onChange={(e) =>
                      setFormState({ ...formState, name_np: e.target.value })
                    }
                  />
                </div>
              </Form.Item>
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
                onClick={() => setOpenDeleteAlert(true)}
              >
                Delete Rasan Choice
              </button>

              <button
                className="bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors"
                type="button"
                onClick={async () => {
                  await handleSave();
                }}
              >
                {handleUpdateProductGroup.status === "loading"
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

export default EditProductGroup;
