import { Button, Dropdown, Space, Table, Menu, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { capitalize, isEmpty, uniqBy } from "lodash";
import { DeleteOutlined } from "@ant-design/icons";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import {
  deleteBulkTutorials,
  deleteTutorials,
  getPaginatedTutorials,
  publishTutorial,
} from "../../../api/tutorial";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import {
  GET_PAGINATED_TUTORIALS,
  GET_TUTORIALS_BY_ID,
} from "../../../constants/queryKeys";
import ButtonWPermission from "../../../shared/ButtonWPermission";

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

  const [isDeleteTutorialsModal, setIsDeleteTutorialsModal] = useState({
    isOpen: false,
    type: "",
    title: "",
  });

  const [page, setPage] = useState(1);

  const [slugs, setSlugs] = useState([]);

  const [pageSize, setPageSize] = useState(20);

  const [tutorialList, setTutorialList] = useState([]);

  const {
    data,
    status,
    refetch: refetchTutorials,
    isRefetching,
  } = useQuery({
    queryFn: () => getPaginatedTutorials(page, pageSize),
    queryKey: [GET_PAGINATED_TUTORIALS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setTutorialList([]);
      setTutorialList((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchTutorials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleDeleteTutorial = useMutation(
    () =>
      isDeleteTutorialsModal.type === "bulk"
        ? deleteBulkTutorials(slugs)
        : deleteTutorials(slugs),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchTutorials();
        setIsDeleteTutorialsModal({ isOpen: false, title: "", type: "" });
        setSlugs([]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

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
      width: "13%",
      render: (_, { slug, title, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <ButtonWPermission
              className="w-20 text-center"
              codename="change_tutorial"
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
            </ButtonWPermission>

            <ButtonWPermission
              className="!border-none"
              codename="delete_tutorial"
              icon={
                <DeleteOutlined
                  onClick={() => {
                    setIsDeleteTutorialsModal({
                      isOpen: true,
                      title: `Delete ${title}?`,
                      type: "single",
                    });
                    setSlugs([slug]);
                  }}
                />
              }
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
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_tutorial"
              disabled={isEmpty(slugs)}
              onClick={() =>
                setIsDeleteTutorialsModal({
                  isOpen: true,
                  title: "Delete all tutorials?",
                  type: "bulk",
                })
              }
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
      setSlugs(selectedRows.map((el) => el.slug));
    },
  };

  const dataSourceTutorials = tutorialList?.map((el, index) => {
    return {
      key: (page - 1) * pageSize + index + 1,
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
        <ButtonWPermission
          className="flex items-center"
          codename="add_tutorial"
          type="primary"
          ghost
          onClick={() => {
            navigate("create");
          }}
        >
          Create Tutorial
        </ButtonWPermission>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={dataSourceTutorials}
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

      <ConfirmDelete
        closeModal={() =>
          setIsDeleteTutorialsModal({
            ...isDeleteTutorialsModal,
            isOpen: false,
          })
        }
        deleteMutation={() => handleDeleteTutorial.mutate()}
        isOpen={isDeleteTutorialsModal.isOpen}
        status={handleDeleteTutorial.status}
        title={isDeleteTutorialsModal.title}
      />
    </div>
  );
};

export default TutorialList;
