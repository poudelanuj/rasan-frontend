import { Button, Dropdown, Space, Table, Menu, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { capitalize, uniqBy } from "lodash";
import { DeleteOutlined } from "@ant-design/icons";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import {
  deleteTutorials,
  getPaginatedTutorials,
  publishTutorial,
} from "../../../api/tutorial";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import {
  GET_PAGINATED_TUTORIALS,
  GET_TUTORIALS_BY_ID,
} from "../../../constants/queryKeys";

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

const TutorialList = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [isDeleteTutorialsModalOpen, setIsDeleteTutorialsModalOpen] =
    useState(false);

  const [deleteTutorialsModalTitle, setDeleteTutorialsModalTitle] =
    useState("");

  const [page, setPage] = useState(1);

  const [slugs, setSlugs] = useState([]);

  const pageSize = 20;

  const [tutorialList, setTutorialList] = useState([]);

  const {
    data,
    status,
    refetch: refetchTutorials,
    isRefetching: refetchingTutorials,
  } = useQuery({
    queryFn: () => getPaginatedTutorials(page, pageSize),
    queryKey: [GET_PAGINATED_TUTORIALS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setTutorialList((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data]);

  useEffect(() => {
    refetchTutorials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteTutorial = useMutation(() => deleteTutorials(slugs), {
    onSuccess: (res) => {
      openSuccessNotification(res[0].data.message);
      refetchTutorials();
      setIsDeleteTutorialsModalOpen(false);
      setSlugs([]);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handlePublishTutorial = useMutation(
    ({ slug, shouldPublish }) => publishTutorial({ slug, shouldPublish }),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTutorials();
        queryClient.refetchQueries([GET_TUTORIALS_BY_ID]);
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
      render: (_, { slug, title, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={is_published} //* TODO
              loading={
                handlePublishTutorial.variables &&
                handlePublishTutorial.variables.slug === slug &&
                handlePublishTutorial.isLoading
              }
              size="small"
              type="primary"
              onClick={() =>
                handlePublishTutorial.mutate({
                  slug: slug,
                  shouldPublish: !is_published,
                })
              }
            >
              {is_published ? "Unpublish" : "Publish"}
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

  const dataSourceTutorials = tutorialList?.map((el, index) => {
    return {
      key: index + 1,
      title: el.title,
      page_location: capitalize(el.page_location).replaceAll("_", " "),
      type: capitalize(el.type),
      status: el.is_published ? "Published" : "Not published",
      slug: el.slug,
      published_at: el.published_at,
      is_published: el.is_published,
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
        pagination={{
          pageSize,
          total: data?.count,

          onChange: (page, pageSize) => {
            setPage(page);
          },
        }}
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
