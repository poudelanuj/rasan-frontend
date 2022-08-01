import { Button, Dropdown, Space, Table, Menu, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteTutorialsModal from "./components/DeleteTutorialsModal";

export const getStatusColor = (status) => {
  switch (status) {
    case "Published":
      return "green";
    case "Unpublished":
      return "orange";
    default:
      return "green";
  }
};

const TutorialList = ({ dataSource, status, refetchTutorials }) => {
  const navigate = useNavigate();

  const [isDeleteTutorialsModalOpen, setIsDeleteTutorialsModalOpen] =
    useState(false);

  const [deleteTutorialsModalTitle, setDeleteTutorialsModalTitle] =
    useState("");

  const [slugs, setSlugs] = useState([]);

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
      width: "28%",
    },
    {
      title: "Page Location",
      dataIndex: "page_location",
      key: "page_location",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <>
            <Tag color={getStatusColor(status)}>
              {status.toUpperCase().replaceAll("_", " ")}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_, { slug, title }) => {
        return (
          <DeleteOutlined
            className="ml-5"
            onClick={() => {
              setIsDeleteTutorialsModalOpen(true);
              setDeleteTutorialsModalTitle(`Delete ${title}?`);
              setSlugs([slug]);
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
                setIsDeleteTutorialsModalOpen(true);
                setDeleteTutorialsModalTitle(`Delete all tutorials?`);
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
      setSlugs(selectedRows.map((el) => el.slug));
    },
  };

  const dataSourceTutorials = dataSource?.map((el, index) => {
    return {
      key: index + 1,
      title: el.title,
      page_location:
        el.page_location.charAt(0).toUpperCase() +
        el.page_location.slice(1).replace("_", " "),
      tags: el.tags === [] ? el.tags[0] : el.tags,
      type: el.type.charAt(0).toUpperCase() + el.type.slice(1),
      status: el.published_at ? "Published" : "Unpublished",
      slug: el.slug,
    };
  });

  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <Button
          className="flex items-center"
          type="primary"
          ghost
          onClick={() => {
            navigate("create");
          }}
        >
          Create Tutorial
        </Button>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={dataSourceTutorials}
        rowClassName="cursor-pointer"
        rowSelection={{ ...rowSelection }}
      />

      <DeleteTutorialsModal
        isDeleteTutorialsModalOpen={isDeleteTutorialsModalOpen}
        refetchTutorials={refetchTutorials}
        setIsDeleteTutorialsModalOpen={setIsDeleteTutorialsModalOpen}
        slugs={slugs}
        title={deleteTutorialsModalTitle}
      />
    </div>
  );
};

export default TutorialList;
