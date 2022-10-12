import { Button, Dropdown, Space, Table, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { isEmpty, uniqBy } from "lodash";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import CreateTutorialTagsModal from "./components/CreateTutorialTagsModal";
import {
  deleteBulkTutorialTags,
  deleteTutorialTags,
  getPaginatedTags,
} from "../../../api/tutorial";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import { GET_PAGINATED_TAGLISTS } from "../../../constants/queryKeys";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const TutorialTagsList = () => {
  const [isCreateTagsModalOpen, setIsCreateTagsModalOpen] = useState(false);

  const [isDeleteTagsModal, setIsDeleteTagsModal] = useState({
    isOpen: false,
    title: "",
    type: "",
  });

  const [tagIds, setTagsIds] = useState([]);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [tutorialTagList, setTutorialTagList] = useState([]);

  const {
    data,
    status,
    refetch: refetchTags,
    isRefetching,
  } = useQuery({
    queryFn: () => getPaginatedTags(page, pageSize),
    queryKey: [GET_PAGINATED_TAGLISTS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setTutorialTagList([]);
      setTutorialTagList((prev) => uniqBy([...prev, ...data], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleDeleteTutorialTags = useMutation(
    () =>
      isDeleteTagsModal.type === "bulk"
        ? deleteBulkTutorialTags(tagIds)
        : deleteTutorialTags(tagIds),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTags();
        setIsDeleteTagsModal({ ...isDeleteTagsModal, isOpen: false });
        setTagsIds([]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_, { id, title }) => {
        return (
          <ButtonWPermission
            className="!border-none"
            codename="delete_tutorialtag"
            icon={
              <DeleteOutlined
                onClick={() => {
                  setTagsIds([id]);
                  setIsDeleteTagsModal({
                    isOpen: true,
                    title: `Delete ${title}?`,
                    type: "single",
                  });
                }}
              />
            }
          />
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
            <ButtonWPermission
              className="!border-none !text-current !bg-inherit"
              codename="delete_tutorialtag"
              disabled={isEmpty(tagIds)}
              onClick={() => {
                setIsDeleteTagsModal({
                  isOpen: true,
                  title: "Delete all tags?",
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
      setTagsIds(selectedRows.map((el) => el.id));
    },
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Button
          className="flex items-center"
          type="primary"
          ghost
          onClick={() => {
            setIsCreateTagsModalOpen(true);
          }}
        >
          Create Tags
        </Button>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={tutorialTagList?.map((el, index) => {
          return {
            key: (page - 1) * pageSize + index + 1,
            title: el.tag,
            id: el.id,
          };
        })}
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

      <CreateTutorialTagsModal
        isCreateTagsModalOpen={isCreateTagsModalOpen}
        refetchTags={refetchTags}
        setIsCreateTagsModalOpen={setIsCreateTagsModalOpen}
      />

      <ConfirmDelete
        closeModal={() =>
          setIsDeleteTagsModal({ ...isDeleteTagsModal, isOpen: false })
        }
        deleteMutation={() => handleDeleteTutorialTags.mutate()}
        isOpen={isDeleteTagsModal.isOpen}
        status={handleDeleteTutorialTags.status}
        title={isDeleteTagsModal.title}
      />
    </div>
  );
};

export default TutorialTagsList;
