import { Button, Table, Tag, Menu, Space, Dropdown } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { capitalize, isEmpty, uniqBy } from "lodash";
import { useState, useEffect } from "react";
import { PUBLISHED, UNPUBLISHED } from "../../constants";
import ConfirmDelete from "../../shared/ConfirmDelete";
import {
  deleteRedeemableProduct,
  publishRedeemableProduct,
  getPaginatedRedeemableProduct,
  deleteBulkRedeemableProduct,
} from "../../api/loyaltyRedeem";
import {
  GET_LOYALTY_REDEEM_ARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL,
  GET_LOYALTY_REDEEM_UNARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL,
  GET_LOYALTY_REDEEM_BY_ID,
} from "../../constants/queryKeys";
import { getStatusColor } from ".";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../utils";

import ButtonWPermission from "../../shared/ButtonWPermission";

const Deals = ({ type, isArchived, queryKey }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [deleteDealsModal, setDeleteDealsModal] = useState({
    isOpen: false,
    title: "",
    type: "",
  });

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [dealsId, setDealsId] = useState([]);

  const [deals, setDeals] = useState([]);

  const {
    data,
    status,
    refetch: refetchLoyaltyRedeem,
    isRefetching,
  } = useQuery({
    queryFn: () =>
      getPaginatedRedeemableProduct(page, pageSize, type, isArchived),
    queryKey: [queryKey],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setDeals([]);
      setDeals((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchLoyaltyRedeem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleDeleteLoyaltyRedeem = useMutation(
    () =>
      deleteDealsModal.type === "bulk"
        ? deleteBulkRedeemableProduct(dealsId)
        : deleteRedeemableProduct(dealsId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        setDeleteDealsModal({
          ...deleteDealsModal,
          isOpen: false,
        });
        setDealsId([]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_ARCHIVED_RASAN]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_UNARCHIVED_RASAN]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handlePublishLoyaltyRedeem = useMutation(
    ({ id, shouldPublish }) => publishRedeemableProduct({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchLoyaltyRedeem();
        queryClient.removeQueries([GET_LOYALTY_REDEEM_BY_ID]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const dealsDataSource = deals?.map((el, index) => {
    return {
      id: el.id,
      key: (page - 1) * pageSize + index + 1,
      product_sku: capitalize(parseSlug(el.product_sku)),
      loyalty_points: el.loyalty_points + " points",
      total_quota: el.quota,
      redeemed_items: el.redeems_made,
      status: el.is_published ? "Published" : "Not published",
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
          <Tag
            color={
              is_published
                ? getStatusColor(PUBLISHED)
                : getStatusColor(UNPUBLISHED)
            }
          >
            {status.toUpperCase()}
          </Tag>
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
            <ButtonWPermission
              className="w-20 text-center"
              codename="change_loyalty"
              danger={is_published}
              loading={
                handlePublishLoyaltyRedeem.variables &&
                handlePublishLoyaltyRedeem.variables.id === id &&
                handlePublishLoyaltyRedeem.isLoading
              }
              size="small"
              type="primary"
              onClick={() =>
                handlePublishLoyaltyRedeem.mutate({
                  id: id,
                  shouldPublish: !is_published,
                })
              }
            >
              {is_published ? "Unpublish" : "Publish"}
            </ButtonWPermission>

            <ButtonWPermission
              className="!border-none"
              codename="delete_loyalty"
              icon={
                <DeleteOutlined
                  onClick={() => {
                    setDeleteDealsModal({
                      ...deleteDealsModal,
                      isOpen: true,
                      title: `Delete ${product_sku}?`,
                      type: "single",
                    });
                    setDealsId([id]);
                  }}
                />
              }
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
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_loyalty"
              disabled={isEmpty(dealsId)}
              onClick={() => {
                setDeleteDealsModal({
                  ...deleteDealsModal,
                  isOpen: true,
                  title: "Delete all Redeemable Products?",
                  type: "bulk",
                });
              }}
            >
              Delete
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <div className="mb-4 flex justify-between">
        <ButtonWPermission
          className="flex items-center"
          codename="add_loyalty"
          type="primary"
          ghost
          onClick={() => navigate("create")}
        >
          Create Loyalty Redeem
        </ButtonWPermission>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={dealsDataSource}
        loading={status === "loading" || isRefetching}
        pagination={{
          showSizeChanger: true,
          pageSize,
          total: data?.count,
          current: page,

          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        rowSelection={{ ...rowSelection }}
      />

      <ConfirmDelete
        closeModal={() =>
          setDeleteDealsModal({
            ...deleteDealsModal,
            isOpen: false,
          })
        }
        deleteMutation={() => handleDeleteLoyaltyRedeem.mutate()}
        isOpen={deleteDealsModal.isOpen}
        status={handleDeleteLoyaltyRedeem.status}
        title={deleteDealsModal.title}
      />
    </>
  );
};

export default Deals;
