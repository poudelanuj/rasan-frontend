import { Button, Dropdown, Space, Table, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { useState } from "react";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import CreateTutorialTagsModal from "./components/CreateTutorialTagsModal";
import { deleteTutorialTags } from "../../../api/tutorial";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";

const TutorialTagsList = ({
  dataSource,
  status,
  refetchTags,
  refetchingTags,
}) => {
  const [isCreateTagsModalOpen, setIsCreateTagsModalOpen] = useState(false);

  const [isDeleteTagsModalOpen, setIsDeleteTagsModalOpen] = useState(false);

  const [deleteTagsModalTitle, setDeleteTagsModalTitle] = useState("");

  const [tagIds, setTagsIds] = useState([]);

  const handleDeleteTutorialTags = useMutation(
    () => deleteTutorialTags(tagIds),
    {
      onSuccess: (res) => {
        openSuccessNotification(res[0].data.message);
        refetchTags();
        setIsDeleteTagsModalOpen(false);
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
          <DeleteOutlined
            className="ml-5"
            onClick={() => {
              setIsDeleteTagsModalOpen(true);
              setDeleteTagsModalTitle(`Delete ${title}?`);
              setTagsIds([id]);
            }}
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
            <div
              onClick={() => {
                setIsDeleteTagsModalOpen(true);
                setDeleteTagsModalTitle(`Delete all tags?`);
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
        dataSource={dataSource?.map((el, index) => {
          return { key: index + 1, title: el.tag, id: el.id };
        })}
        loading={status === "loading" || refetchingTags}
        rowClassName="cursor-pointer"
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
