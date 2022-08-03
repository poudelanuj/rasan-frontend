import { Button, Dropdown, Space, Table, Menu, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import { deleteTutorials, publishTutorial } from "../../../api/tutorial";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";

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

const TutorialList = ({
  dataSource,
  status,
  refetchTutorials,
  refetchingTutorials,
}) => {
  const navigate = useNavigate();

  const [isDeleteTutorialsModalOpen, setIsDeleteTutorialsModalOpen] =
    useState(false);

  const [deleteTutorialsModalTitle, setDeleteTutorialsModalTitle] =
    useState("");

  const [slugs, setSlugs] = useState([]);

  const handleDeleteTutorial = useMutation(() => deleteTutorials(slugs), {
    onSuccess: (res) => {
      openSuccessNotification(res[0].data.message);
      refetchTutorials();
      setIsDeleteTutorialsModalOpen(false);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handlePublishTutorial = useMutation(
    ({ slug, shouldPublish }) => publishTutorial({ slug, shouldPublish }),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTutorials();
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "35%",
      render: (_, { slug, title }) => (
        <div
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`update/${slug}`)}
        >
          {title}
        </div>
      ),
    },
    {
      title: "Page Location",
      dataIndex: "page_location",
      key: "page_location",
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
            <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render: (_, { slug, title, published_at }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={published_at ? true : false}
              loading={handlePublishTutorial.isLoading}
              size="small"
              type="primary"
              onClick={() =>
                handlePublishTutorial.mutate({
                  slug: slug,
                  shouldPublish: published_at ? false : true,
                })
              }
            >
              {published_at ? "Unpublish" : "Publish"}
            </Button>
            <DeleteOutlined
              className="ml-5"
              onClick={() => {
                setIsDeleteTutorialsModalOpen(true);
                setDeleteTutorialsModalTitle(`Delete ${title}?`);
                setSlugs([slug]);
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
      published_at: el.published_at,
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
        loading={status === "loading" || refetchingTutorials}
        rowSelection={{ ...rowSelection }}
      />

      <ConfirmDelete
        closeModal={() => setIsDeleteTutorialsModalOpen(false)}
        deleteMutation={() => handleDeleteTutorial.mutate()}
        isOpen={isDeleteTutorialsModalOpen}
        status={handleDeleteTutorial.status}
        title={deleteTutorialsModalTitle}
      />
    </div>
  );
};

export default TutorialList;
