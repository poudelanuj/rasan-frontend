import { PlusOutlined } from "@ant-design/icons";
import { message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateShop } from "../context/UserContext";

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
      console.log(url);
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
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={() => false}
        onChange={handleChange}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default ShopPhotos;
