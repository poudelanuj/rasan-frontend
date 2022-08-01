import { Button, Dropdown, Space, Table, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

import CreateTutorialTagsModal from "./components/CreateTutorialTagsModal";
import DeleteTagsModal from "./components/DeleteTagsModal";

const TutorialTagsList = ({ dataSource, status, refetchTags }) => {
  const [isCreateTagsModalOpen, setIsCreateTagsModalOpen] = useState(false);

  const [isDeleteTagsModalOpen, setIsDeleteTagsModalOpen] = useState(false);

  const [deleteTagsModalTitle, setDeleteTagsModalTitle] = useState("");

  const [tagIds, setTagsIds] = useState([]);

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
        loading={status === "loading"}
        rowClassName="cursor-pointer"
        rowSelection={{ ...rowSelection }}
      />

      <CreateTutorialTagsModal
        isCreateTagsModalOpen={isCreateTagsModalOpen}
        refetchTags={refetchTags}
        setIsCreateTagsModalOpen={setIsCreateTagsModalOpen}
      />

      <DeleteTagsModal
        ids={tagIds}
        isDeleteTagsModalOpen={isDeleteTagsModalOpen}
        refetchTags={refetchTags}
        setIsDeleteTagsModalOpen={setIsDeleteTagsModalOpen}
        title={deleteTagsModalTitle}
      />
    </div>
  );
};

export default TutorialTagsList;
