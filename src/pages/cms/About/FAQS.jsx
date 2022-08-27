import { Dropdown, Space, Button, Menu, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { uniqBy } from "lodash";
import moment from "moment";
import {
  deleteFAQGroups,
  getPaginatedFAQGroups,
  publishFAQGroups,
} from "../../../api/aboutus";
import { GET_PAGINATED_FAQ_GROUPS } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CreateFAQGroupsModal from "./components/CreateFAQGroupsModal";
import UpdateFAQGroupsModal from "./components/UpdateFAQGroupsModal";

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

const FAQS = () => {
  const navigate = useNavigate();

  const [faqIds, setFaqIds] = useState([]);

  const [isDeleteFAQModal, setIsDeleteFAQModal] = useState({
    isOpen: false,
    title: "",
  });

  const [isCreateFAQGroupsModalOpen, setIsCreateFAQGroupsModalOpen] =
    useState(false);

  const [isUpdateFAQGroupsModalOpen, setIsUpdateFAQGroupsModalOpen] =
    useState(false);

  const [page, setPage] = useState(1);

  const pageSize = 20;

  const [faqGroups, setFaqGroups] = useState([]);

  const {
    data,
    status,
    refetch: refetchFAQGroups,
    isRefetching,
  } = useQuery({
    queryFn: () => getPaginatedFAQGroups(page, pageSize),
    queryKey: [GET_PAGINATED_FAQ_GROUPS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setFaqGroups([]);
      setFaqGroups((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetchFAQGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteFAQGroups = useMutation(() => deleteFAQGroups(faqIds), {
    onSuccess: (data) => {
      openSuccessNotification(data[0].data.message);
      setIsDeleteFAQModal({ ...isDeleteFAQModal, isOpen: false });
      refetchFAQGroups();
      setFaqIds([]);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handlePublishFAQGroups = useMutation(
    ({ id, shouldPublish }) => publishFAQGroups({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchFAQGroups();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
      width: "5%",
    },
    {
      title: "FAQ Groups",
      dataIndex: "name",
      key: "name",
      width: "23%",
      render: (_, { id, name }) => (
        <div
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`faqs/${id}`)}
        >
          {name}
        </div>
      ),
    },
    {
      title: "FAQ Groups in Nepali",
      dataIndex: "name_np",
      key: "name_np",
    },
    {
      title: "Published at",
      dataIndex: "published_at",
      key: "published_at",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <>
            <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "16%",
      render: (_, { id, name, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={is_published}
              loading={
                handlePublishFAQGroups.variables &&
                handlePublishFAQGroups.variables.id === id &&
                handlePublishFAQGroups.isLoading
              }
              size="small"
              type="primary"
              onClick={() =>
                handlePublishFAQGroups.mutate({
                  id: id,
                  shouldPublish: !is_published,
                })
              }
            >
              {is_published ? "Unpublish" : "Publish"}
            </Button>
            <EditOutlined
              onClick={() => {
                setIsUpdateFAQGroupsModalOpen(true);
                setFaqIds([id]);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                setIsDeleteFAQModal({
                  ...isDeleteFAQModal,
                  isOpen: true,
                  title: `Delete ${name}?`,
                });
                setFaqIds([id]);
              }}
            />
          </div>
        );
      },
    },
  ];

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => {
                setIsDeleteFAQModal({
                  ...isDeleteFAQModal,
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

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setFaqIds(selectedRows.map((el) => el.id));
    },
  };

  const FAQGroups = faqGroups?.map((el, index) => {
    return {
      id: el.id,
      key: index + 1,
      name: el.name,
      name_np: el.name_np,
      published_at: el.published_at
        ? moment(el.published_at).format("ll")
        : "Not published",
      status: el.is_published ? "Published" : "Not published",
      is_published: el.is_published,
    };
  });

  return (
    <>
      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <Button
              className="flex items-center"
              type="primary"
              ghost
              onClick={() => setIsCreateFAQGroupsModalOpen(true)}
            >
              Create FAQ Groups
            </Button>

            <Dropdown overlay={bulkMenu}>
              <Button className="bg-white" type="default">
                <Space>Bulk Actions</Space>
              </Button>
            </Dropdown>
          </div>

          <Table
            columns={columns}
            dataSource={FAQGroups}
            loading={status === "loading" || isRefetching}
            pagination={{
              pageSize,
              total: data?.count,

              onChange: (page, pageSize) => {
                setPage(page);
              },
            }}
            rowSelection={{ ...rowSelection }}
          />

          <CreateFAQGroupsModal
            isCreateFAQGroupsModalOpen={isCreateFAQGroupsModalOpen}
            refetchFAQGroups={refetchFAQGroups}
            setIsCreateFAQGroupsModalOpen={setIsCreateFAQGroupsModalOpen}
          />
          <UpdateFAQGroupsModal
            faqIds={faqIds}
            isUpdateFAQGroupsModalOpen={isUpdateFAQGroupsModalOpen}
            refetchFAQGroups={refetchFAQGroups}
            setIsUpdateFAQGroupsModalOpen={setIsUpdateFAQGroupsModalOpen}
          />

          <ConfirmDelete
            closeModal={() =>
              setIsDeleteFAQModal({ ...isDeleteFAQModal, isOpen: false })
            }
            deleteMutation={() => handleDeleteFAQGroups.mutate()}
            isOpen={isDeleteFAQModal.isOpen}
            status={handleDeleteFAQGroups.status}
            title={isDeleteFAQModal.title}
          />
        </>
      )}
    </>
  );
};

export default FAQS;
