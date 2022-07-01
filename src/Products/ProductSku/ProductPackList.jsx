import React from "react";
import { useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditProductPack from "./EditProductPack";

function ProductPackList({ productPacks }) {
  const [openEditPack, setOpenEditPack] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);

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
          <Button>
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
