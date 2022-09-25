import { Button, Dropdown, Space, Table, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { isEmpty, uniqBy } from "lodash";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import CreateTutorialTagsModal from "./components/CreateTutorialTagsModal";
import { deleteTutorialTags, getPaginatedTags } from "../../../api/tutorial";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import { GET_PAGINATED_TAGLISTS } from "../../../constants/queryKeys";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const TutorialTagsList = () => {
  const [isCreateTagsModalOpen, setIsCreateTagsModalOpen] = useState(false);

  const [isDeleteTagsModalOpen, setIsDeleteTagsModalOpen] = useState(false);

  const [deleteTagsModalTitle, setDeleteTagsModalTitle] = useState("");

  const [tagIds, setTagsIds] = useState([]);

  const [page, setPage] = useState(1);

  const pageSize = 20;

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
    if (data) {
      setTutorialTagList([]);
      setTutorialTagList((prev) => uniqBy([...prev, ...data], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteTutorialTags = useMutation(
    () => deleteTutorialTags(tagIds),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTags();
        setIsDeleteTagsModalOpen(false);
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
                  setIsDeleteTagsModalOpen(true);
                  setDeleteTagsModalTitle(`Delete ${title}?`);
                  setTagsIds([id]);
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
                setIsDeleteTagsModalOpen(true);
                setDeleteTagsModalTitle(`Delete all tags?`);
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
          return { key: index + 1, title: el.tag, id: el.id };
        })}
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

      <CreateTutorialTagsModal
        isCreateTagsModalOpen={isCreateTagsModalOpen}
        refetchTags={refetchTags}
        setIsCreateTagsModalOpen={setIsCreateTagsModalOpen}
      />

      <ConfirmDelete
        closeModal={() => setIsDeleteTagsModalOpen(false)}
        deleteMutation={() => handleDeleteTutorialTags.mutate()}
        isOpen={isDeleteTagsModalOpen}
        status={handleDeleteTutorialTags.status}
        title={deleteTagsModalTitle}
      />
    </div>
  );
};

export default TutorialTagsList;
