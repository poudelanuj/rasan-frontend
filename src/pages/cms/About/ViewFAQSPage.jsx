import { useQuery } from "react-query";
import { Table, Tag, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { useParams } from "react-router-dom";
import { getFAQGroupsById } from "../../../api/aboutus";
import { GET_FAQ_GROPUS_BY_ID } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import { useState } from "react";
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

const ViewFAQSPage = () => {
  const { id } = useParams();

  const [ids, setIds] = useState([]);

  const {
    data: dataSource,
    isFetching,
    status,
    refetch: refetchFAQs,
  } = useQuery({
    queryFn: () => getFAQGroupsById(id),
    queryKey: [GET_FAQ_GROPUS_BY_ID, id],
    enabled: !!id,
  });

  const dataSourceFAQs = dataSource?.faqs.map((el, index) => {
    return {
      key: index + 1,
      id: el.id,
      title: el.title,
      title_np: el.title_np,
      content: el.content,
      content_np: el.content_np,
      published_at: moment(el.published_at).format("ll"),
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
        <div className="text-blue-500 cursor-pointer hover:underline">
          {title}
        </div>
      ),
    },
    {
      title: "Title in Nepali",
      dataIndex: "title_np",
      key: "title_np",
      width: "23%",
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
      render: (_, { id, title, is_published }) => {
        return (
          <div className="flex items-center justify-between">
            <Button
              className="w-20 text-center"
              danger={is_published} //* TODO
              /* loading={
                handlePublishFAQGroups.variables &&
                handlePublishFAQGroups.variables.id === id &&
                handlePublishFAQGroups.isLoading
              }*/
              size="small"
              type="primary"
              /* onClick={() =>
                handlePublishFAQGroups.mutate({
                  id: id,
                  shouldPublish: !is_published,
                })
              }*/
            >
              {is_published ? "Unpublish" : "Publish"}
            </Button>
            <EditOutlined
            /* onClick={() => {
                setIsUpdateFAQGroupsModalOpen(true);
                setIds([id]);
              }} */
            />
            <DeleteOutlined
            /* onClick={() => {
                setIsDeleteFAQGroupsModalOpen(true);
                setDeleteFAQGroupsModalTitle(`Delete ${name}?`);
                setIds([id]);
              }}*/
            />
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setIds(selectedRows.map((el) => el.id));
    },
  };

  return (
    <>
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <CustomPageHeader title={dataSource?.name} />
          {dataSource && (
            <Table
              columns={columns}
              dataSource={dataSourceFAQs}
              loading={status === "loading" || refetchFAQs}
              rowSelection={{ ...rowSelection }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ViewFAQSPage;
