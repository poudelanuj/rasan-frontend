import React from "react";
import { useMutation } from "react-query";
import { useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditProductPack from "./EditProductPack";
import { DELETE_PRODUCT_PACK } from "../../constants/queryKeys";
import { deleteProductPack } from "../../api/productPack";
import ConfirmDelete from "../../shared/ConfirmDelete";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";

function ProductPackList({ productPacks, refetchProductSku }) {
  const [openEditPack, setOpenEditPack] = useState(false);
  const [openConfirmDelete, setConfirmDelete] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);

  const handleDelete = useMutation((id) => deleteProductPack(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Product Pack Deleted");
      refetchProductSku();
    },
    onError: (err) => {
      openErrorNotification(err);
    },
    onSettled: () => {
      setConfirmDelete(false);
    },
  });

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
            onClick={() => {
              setSelectedPack(record);
              setConfirmDelete(true);
            }}
          >
            <DeleteOutlined />
          </Button>
          <Button>
            <EditOutlined
              onClick={() => {
                setOpenEditPack(true);
                setSelectedPack(record);
              }}
            />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {openEditPack && <EditProductPack id={selectedPack?.id} />}
      <ConfirmDelete
        closeModal={() => setConfirmDelete(false)}
        deleteMutation={() => handleDelete.mutate(selectedPack?.id)}
        isOpen={openConfirmDelete}
        status={handleDelete.status}
        title="Delete Product Pack"
      />

      <h3 className="text-xl text-[#374253] mb-4">Product Pack Details</h3>

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
