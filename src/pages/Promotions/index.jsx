import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Dropdown, Space, Menu, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { capitalize } from "lodash";
import {
  deletePromotions,
  getPromotions,
  publishPromotions,
} from "../../api/promotions";
import {
  GET_PROMOTIONS,
  GET_PROMOTIONS_BY_ID,
} from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import Loader from "../../shared/Loader";
import { PUBLISHED, UNPUBLISHED } from "../../constants";
import ConfirmDelete from "../../shared/ConfirmDelete";

export const getStatusColor = (status) => {
  switch (status) {
    case PUBLISHED:
      return "green";
    case UNPUBLISHED:
      return "orange";
    default:
      return "green";
  }
};

const Promotions = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [promotionsIds, setPromotionsIds] = useState([]);

  const {
    data: dataSourcePromotions,
    refetch: refetchPromotions,
    status,
  } = useQuery({ queryFn: () => getPromotions(), queryKey: GET_PROMOTIONS });

  const [isDeletePromotionsModal, setIsDeletePromotionsModal] = useState({
    isOpen: false,
    title: "",
  });

  const handleDeletePromotions = useMutation(
    () => deletePromotions(promotionsIds),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data[0].data.message || "Promotions Deleted Successfully"
        );
        setIsDeletePromotionsModal({
          ...isDeletePromotionsModal,
          isOpen: false,
        });
        refetchPromotions();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handlePublishPromotions = useMutation(
    ({ id, shouldPublish }) => publishPromotions({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchPromotions();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => {
                setIsDeletePromotionsModal({
                  ...isDeletePromotionsModal,
                  isOpen: true,
                  title: "Delete all Promotions?",
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

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setPromotionsIds(selectedRows.map((el) => el.id));
    },
  };

  const promotions = dataSourcePromotions?.map((el, index) => {
    return {
      id: el.id,
      key: index + 1,
      title: el.title,
      type: capitalize(el.type).replaceAll("_", " "),
      context: el.brand || el.category || el.product_group,
      bannersCount: el.banners.length,
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "23%",
      render: (_, { id, title }) => (
        <div
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`${id}`)}
        >
          {title}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Context",
      dataIndex: "context",
      key: "context",
      render: (_, { context }) => (
        <>{capitalize(context).replaceAll("-", " ")}</>
      ),
    },
    {
      title: "No. of Banners",
      dataIndex: "bannersCount",
      key: "bannersCount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "14%",
      render: (_, { id, title, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={is_published}
              loading={
                handlePublishPromotions.variables &&
                handlePublishPromotions.variables.id === id &&
                handlePublishPromotions.isLoading
              }
              size="small"
              type="primary"
              onClick={() => {
                handlePublishPromotions.mutate({
                  id: id,
                  shouldPublish: !is_published,
                });
                queryClient.removeQueries([GET_PROMOTIONS_BY_ID]);
              }}
            >
              {is_published ? "Unpublish" : "Publish"}
            </Button>

            <DeleteOutlined
              onClick={() => {
                setIsDeletePromotionsModal({
                  ...isDeletePromotionsModal,
                  isOpen: true,
                  title: `Delete ${title}?`,
                });
                setPromotionsIds([id]);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <CustomPageHeader title="Promotions" isBasicHeader />

          <div className="py-5 px-4 bg-[#FFFFFF]">
            <div className="mb-4 flex justify-between">
              <Button
                className="flex items-center"
                type="primary"
                ghost
                onClick={() => navigate("create")}
              >
                Create Promotions
              </Button>

              <Dropdown overlay={bulkMenu}>
                <Button className="bg-white" type="default">
                  <Space>Bulk Actions</Space>
                </Button>
              </Dropdown>
            </div>

            <Table
              columns={columns}
              dataSource={promotions}
              loading={status === "loading" || refetchPromotions}
              rowSelection={{ ...rowSelection }}
            />
          </div>

          <ConfirmDelete
            closeModal={() =>
              setIsDeletePromotionsModal({
                ...isDeletePromotionsModal,
                isOpen: false,
              })
            }
            deleteMutation={() => handleDeletePromotions.mutate()}
            isOpen={isDeletePromotionsModal.isOpen}
            status={handleDeletePromotions.status}
            title={isDeletePromotionsModal.title}
          />
        </>
      )}
    </>
  );
};

export default Promotions;
