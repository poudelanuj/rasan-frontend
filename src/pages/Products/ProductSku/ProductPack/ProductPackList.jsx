import React from "react";
import { useMutation } from "react-query";
import { useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  deleteProductPack,
  publishProductPack,
  unpublishProductPack,
} from "../../../../api/products/productPack";
import ConfirmDelete from "../../../../shared/ConfirmDelete";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import AddProductPack from "./AddProductPack";
import EditProductPack from "./EditProductPack";

function ProductPackList({ productSkuSlug, productPacks, refetchProductSku }) {
  const [openAddPack, setOpenAddPack] = useState(false);
  const [openEditPack, setOpenEditPack] = useState(false);
  const [openConfirmDelete, setConfirmDelete] = useState(false);

  const [selectedPack, setSelectedPack] = useState(null);

  const handleDelete = useMutation((id) => deleteProductPack(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Product Pack Deleted");
      refetchProductSku();
    },
    onError: (err) => openErrorNotification(err),
    onSettled: () => setConfirmDelete(false),
  });

  const handlePublish = useMutation(
    ({ bool, id }) => {
      return bool ? publishProductPack(id) : unpublishProductPack(id);
    },
    {
      onSuccess: (data) => openSuccessNotification(data.message),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchProductSku(),
    }
  );

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sn",
      key: "sn",
      render: (text) => <div className="text-blue-500">#{text}</div>,
    },
    {
      title: "Number Of Items",
      dataIndex: "number_of_items",
      key: "number_of_items",
    },
    {
      title: "Price/Piece",
      dataIndex: "price_per_piece",
      key: "price_per_piece",
    },
    {
      title: "MRP/Piece",
      dataIndex: "mrp_per_piece",
      key: "mrp_per_piece",
    },
    {
      title: "Published",
      dataIndex: "is_published",
      key: "is_published",
      render: (_, { is_published }) => {
        return (
          <Tag color={is_published ? "green" : "orange"}>
            {is_published ? "Published" : "Not Published"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedPack(record);
              setConfirmDelete(true);
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEditPack(true);
              setSelectedPack(record);
            }}
          />
          <Button
            className="rounded"
            disabled={handlePublish.status === "loading"}
            type={record.is_published ? "danger" : "primary"}
            onClick={() =>
              handlePublish.mutate({
                bool: !record.is_published,
                id: record.id,
              })
            }
          >
            {record.is_published ? "Unpublish" : "Publish"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AddProductPack
        closeModal={() => setOpenAddPack(false)}
        isOpen={openAddPack}
        productSkuSlug={productSkuSlug}
        refetchProductSku={refetchProductSku}
      />
      <EditProductPack
        closeModal={() => setOpenEditPack(false)}
        isOpen={openEditPack}
        productPackId={selectedPack?.id}
        productSkuSlug={productSkuSlug}
        refetchProductSku={refetchProductSku}
      />
      <ConfirmDelete
        closeModal={() => setConfirmDelete(false)}
        deleteMutation={() => handleDelete.mutate(selectedPack?.id)}
        isOpen={openConfirmDelete}
        status={handleDelete.status}
        title={`Product Pack #${selectedPack?.sn}`}
      />

      <div className="flex justify-between">
        <h3 className="text-xl text-[#374253] mb-4">Product Pack Details</h3>
        <Button type="primary" onClick={() => setOpenAddPack(true)}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={productPacks}
        onRow={(record) => {
          return {
            onClick: () => {},
          };
        }}
      />
    </>
  );
}

export default ProductPackList;
