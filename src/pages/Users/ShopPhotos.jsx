import { PlusOutlined } from "@ant-design/icons";
import { message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateShop } from "../../context/UserContext";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const ShopPhotos = ({ name, url, label, id }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (!!url && !!name) {
      setFileList([
        {
          name: name,
          status: "done",
          url: url,
        },
      ]);
    }
  }, [url, name]);
  const queryClient = useQueryClient();
  const { mutate: updateShopMutation } = useMutation(updateShop, {
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries(["get-user", `${id}`]);
    },
    onError: (data) => {
      message.error(data.message);
    },
  });
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    let formData = new FormData();
    // add one or more of your files in FormData
    // again, the original file is located at the `originFileObj` key
    setFileList(newFileList);
    formData.append(name, newFileList[0].originFileObj);
    updateShopMutation({ data: formData, key: id });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <div className="text-xl bg-white mb-3">{label}</div>
      <Upload
        beforeUpload={() => false}
        fileList={fileList}
        listType="picture-card"
        maxCount={1}
        onChange={handleChange}
        onPreview={handlePreview}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        footer={null}
        title={previewTitle}
        visible={previewVisible}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          src={previewImage}
          style={{
            width: "100%",
          }}
        />
      </Modal>
    </>
  );
};

export default ShopPhotos;
