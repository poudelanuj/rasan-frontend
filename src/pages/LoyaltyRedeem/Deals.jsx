import { Button, Dropdown, Space, Table, Menu, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { capitalize } from "lodash";
import { useState } from "react";
import { PUBLISHED, UNPUBLISHED } from "../../constants";
import ConfirmDelete from "../../shared/ConfirmDelete";
import { useMutation, useQueryClient } from "react-query";
import {
  deleteReedemableProduct,
  publishReedemableProduct,
} from "../../api/loyaltyRedeem";
import { getStatusColor } from ".";
import { openErrorNotification, openSuccessNotification } from "../../utils";
import { GET_LOYALTY_REDEEM_BY_ID } from "../../constants/queryKeys";

const Deals = ({ deals, refetchLoyaltyRedeem, status }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [dealsId, setDealsId] = useState([]);

  const [isDeleteDealsModal, setIsDeleteDealsModal] = useState({
    isOpen: false,
    title: "",
  });

  const handleDeleteLoyaltyRedeem = useMutation(
    () => deleteReedemableProduct(dealsId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data[0].data.message);
        setIsDeleteDealsModal({
          ...isDeleteDealsModal,
          isOpen: false,
        });
        refetchLoyaltyRedeem();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handlePublishLoyaltyRedeem = useMutation(
    ({ id, shouldPublish }) => publishReedemableProduct({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchLoyaltyRedeem();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const specialDealsDataSource = deals?.map((el, index) => {
    return {
      id: el.id,
      key: index + 1,
      product_sku: capitalize(el.product_sku).replaceAll("-", " "),
      loyalty_points: el.loyalty_points + " points",
      total_quota: el.quota,
      redeemed_items: el.redeems_made,
      status: el.is_published ? "Published" : "Unpublished",
      is_published: el.is_published,
    };
  });

  const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
      width: "5%",
    },
    {
      title: "Product SKU",
      dataIndex: "product_sku",
      key: "product_sku",
      width: "23%",
      render: (_, { id, product_sku }) => (
        <div
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`${id}`)}
        >
          {product_sku}
        </div>
      ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyalty_points",
      key: "loyalty_points",
    },
    {
      title: "Total Quota",
      dataIndex: "total_quota",
      key: "total_quota",
    },
    {
      title: "Redeemed Items",
      dataIndex: "redeemed_items",
      key: "redeemed_items",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { is_published, status }) => {
        return (
          <>
            <Tag
              color={
                is_published
                  ? getStatusColor(PUBLISHED)
                  : getStatusColor(UNPUBLISHED)
              }
            >
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "13%",
      render: (_, { id, product_sku, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={is_published}
              loading={
                handlePublishLoyaltyRedeem.variables &&
                handlePublishLoyaltyRedeem.variables.id === id &&
                handlePublishLoyaltyRedeem.isLoading
              }
              size="small"
              type="primary"
              onClick={() => {
                handlePublishLoyaltyRedeem.mutate({
                  id: id,
                  shouldPublish: !is_published,
                });
                queryClient.removeQueries([GET_LOYALTY_REDEEM_BY_ID]);
              }}
            >
              {is_published ? "Unpublish" : "Publish"}
            </Button>

            <DeleteOutlined
              onClick={() => {
                setIsDeleteDealsModal({
                  ...isDeleteDealsModal,
                  isOpen: true,
                  title: `Delete ${product_sku}?`,
                });
                setDealsId([id]);
              }}
            />
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setDealsId(selectedRows.map((el) => el.id));
    },
  };

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => {
                setIsDeleteDealsModal({
                  ...isDeleteDealsModal,
                  isOpen: true,
                  title: "Delete all FAQ Groups?",
                });
              }}
            >
              Delete
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Button
          className="flex items-center"
          type="primary"
          ghost
          onClick={() => navigate("create")}
        >
          Create Loyalty Redeem
        </Button>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={specialDealsDataSource}
        loading={status === "loading" || refetchLoyaltyRedeem}
        rowSelection={{ ...rowSelection }}
      />

      <ConfirmDelete
        closeModal={() =>
          setIsDeleteDealsModal({
            ...isDeleteDealsModal,
            isOpen: false,
          })
        }
        deleteMutation={() => handleDeleteLoyaltyRedeem.mutate()}
        isOpen={isDeleteDealsModal.isOpen}
        status={handleDeleteLoyaltyRedeem.status}
        title={isDeleteDealsModal.title}
      />
    </>
  );
};

export default Deals;
