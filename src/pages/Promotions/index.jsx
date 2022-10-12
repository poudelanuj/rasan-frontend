import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Dropdown, Space, Menu, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { capitalize, isEmpty, uniqBy } from "lodash";
import {
  deleteBulkPromotions,
  deletePromotions,
  getPaginatedPromotions,
  publishPromotions,
} from "../../api/promotions";
import {
  GET_PAGINATED_PROMOTIONS,
  GET_PROMOTIONS_BY_ID,
} from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import { PUBLISHED, UNPUBLISHED } from "../../constants";
import ConfirmDelete from "../../shared/ConfirmDelete";
import ButtonWPermission from "../../shared/ButtonWPermission";

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

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [dataSourcePromotions, setDataSourcePromotions] = useState([]);

  const [promotionsIds, setPromotionsIds] = useState([]);

  const [isDeletePromotionsModal, setIsDeletePromotionsModal] = useState({
    isOpen: false,
    title: "",
    type: "",
  });

  const {
    data,
    refetch: refetchPromotions,
    status,
    isRefetching,
  } = useQuery({
    queryFn: () => getPaginatedPromotions(page, pageSize),
    queryKey: [GET_PAGINATED_PROMOTIONS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setDataSourcePromotions([]);
      setDataSourcePromotions((prev) =>
        uniqBy([...prev, ...data.results], "id")
      );
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchPromotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleDeletePromotions = useMutation(
    () =>
      isDeletePromotionsModal.type === "bulk"
        ? deleteBulkPromotions(promotionsIds)
        : deletePromotions(promotionsIds),
    {
      onSuccess: (data) => {
        openSuccessNotification(
          data.message || "Promotions Deleted Successfully"
        );
        setIsDeletePromotionsModal({
          ...isDeletePromotionsModal,
          isOpen: false,
        });
        setPromotionsIds([]);
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
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_promotion"
              disabled={isEmpty(promotionsIds)}
              onClick={() => {
                setIsDeletePromotionsModal({
                  ...isDeletePromotionsModal,
                  isOpen: true,
                  title: "Delete all Promotions?",
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

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setPromotionsIds(selectedRows.map((el) => el.id));
    },
  };

  const promotions = dataSourcePromotions?.map((el, index) => {
    return {
      id: el.id,
      key: (page - 1) * pageSize + index + 1,
      title: el.title,
      type: capitalize(el.type).replaceAll("_", " "),
      context: el.brand || el.category || el.product_group,
      bannersCount: el.banners.length,
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
            <ButtonWPermission
              className="w-20 text-center"
              codename="change_promotion"
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
            </ButtonWPermission>

            <ButtonWPermission
              className="!border-none"
              codename="delete_promotion"
              icon={
                <DeleteOutlined
                  onClick={() => {
                    setIsDeletePromotionsModal({
                      ...isDeletePromotionsModal,
                      isOpen: true,
                      title: `Delete ${title}?`,
                      type: "single",
                    });
                    setPromotionsIds([id]);
                  }}
                />
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CustomPageHeader title="Promotions" isBasicHeader />

      <div className="py-5 px-4 bg-[#FFFFFF]">
        <div className="mb-4 flex justify-between">
          <ButtonWPermission
            className="flex items-center"
            codename="add_promotion"
            type="primary"
            ghost
            onClick={() => navigate("create")}
          >
            Create Promotions
          </ButtonWPermission>

          <Dropdown overlay={bulkMenu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>
        </div>

        <Table
          columns={columns}
          dataSource={promotions}
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
  );
};

export default Promotions;
