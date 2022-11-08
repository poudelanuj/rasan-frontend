import React from "react";
import { useMutation } from "react-query";
import { useState } from "react";
import { Input, Space, Table, Tag, Button, Popconfirm } from "antd";
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
import ButtonWPermission from "../../../../shared/ButtonWPermission";
import { useEffect } from "react";

function ProductPackList({ productSkuSlug, productPacks, refetchProductSku }) {
  const [openAddPack, setOpenAddPack] = useState(false);
  const [openEditPack, setOpenEditPack] = useState(false);
  const [openConfirmDelete, setConfirmDelete] = useState(false);

  const [selectedPack, setSelectedPack] = useState(null);

  const [isProductEditable, setIsProductEditable] = useState(false);

  const [editableProductData, setEditableProductData] = useState([]);

  useEffect(() => {
    setEditableProductData(
      productPacks.map((product) => ({
        id: product.id,
        number_of_items: product.number_of_items,
        price_per_piece: product.price_per_piece,
        mrp_per_piece: product.mrp_per_piece,
      }))
    );
  }, [productPacks]);

  const handleProductChange = (event) => {
    const { id, name, value } = event.target;
    setEditableProductData((prev) =>
      prev.map((product) => ({
        ...product,
        [Number(id) === product.id && name]: value,
      }))
    );
  };

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
      title: "S.N.",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Number of Items",
      dataIndex: "number_of_items",
      key: "number_of_items",
      render: (_, { id }) => (
        <Input
          className={`!bg-inherit !text-black  ${
            !isProductEditable && "!border-none"
          }`}
          disabled={!isProductEditable}
          id={id}
          name="number_of_items"
          value={
            editableProductData.find((product) => product.id === id)
              ?.number_of_items
          }
          onChange={handleProductChange}
        />
      ),
    },
    {
      title: "Price/Piece",
      dataIndex: "price_per_piece",
      key: "price_per_piece",
      render: (_, { id }) => (
        <Input
          className={`!bg-inherit !text-black  ${
            !isProductEditable && "!border-none"
          }`}
          disabled={!isProductEditable}
          id={id}
          name="price_per_piece"
          value={
            editableProductData.find((product) => product.id === id)
              ?.price_per_piece
          }
          onChange={handleProductChange}
        />
      ),
    },
    {
      title: "MRP/Piece",
      dataIndex: "mrp_per_piece",
      key: "mrp_per_piece",
      render: (_, { id }) => (
        <Input
          className={`!bg-inherit !text-black  ${
            !isProductEditable && "!border-none"
          }`}
          disabled={!isProductEditable}
          id={id}
          name="mrp_per_piece"
          value={
            editableProductData.find((product) => product.id === id)
              ?.mrp_per_piece
          }
          onChange={handleProductChange}
        />
      ),
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
          <ButtonWPermission
            codename="delete_productpack"
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedPack(record);
              setConfirmDelete(true);
            }}
          />
          <ButtonWPermission
            codename="change_productpack"
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEditPack(true);
              setSelectedPack(record);
            }}
          />
          <ButtonWPermission
            className="rounded"
            codename="change_productpack"
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
          </ButtonWPermission>
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

        <Space>
          {isProductEditable ? (
            <Button
              onClick={() => {
                setIsProductEditable(false);
                setEditableProductData(
                  productPacks.map((product) => ({
                    id: product.id,
                    number_of_items: product.number_of_items,
                    price_per_piece: product.price_per_piece,
                    mrp_per_piece: product.mrp_per_piece,
                  }))
                );
              }}
            >
              Cancel
            </Button>
          ) : (
            <ButtonWPermission
              codename="change_productpack"
              type="primary"
              ghost
              onClick={() => setIsProductEditable(true)}
            >
              Edit
            </ButtonWPermission>
          )}

          <ButtonWPermission
            codename="add_productpack"
            type="primary"
            onClick={() => setOpenAddPack(true)}
          >
            Add New
          </ButtonWPermission>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={productPacks}
        pagination={{
          showTotal: () => (
            <Popconfirm
              cancelText="No"
              okText="Yes"
              title="Are you sure save this detail?"
              onCancel={() => {}}
              onConfirm={() => {}}
            >
              <ButtonWPermission
                codename="change_productpack"
                disabled={!isProductEditable}
                type="primary"
              >
                Save
              </ButtonWPermission>
            </Popconfirm>
          ),
        }}
        scroll={{ x: 700 }}
      />
    </>
  );
}

export default ProductPackList;
