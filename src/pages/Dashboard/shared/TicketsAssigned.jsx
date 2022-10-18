import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import moment from "moment";
import { useQuery } from "react-query";
import { GET_TICKETS_ASSIGNED } from "../../../constants/queryKeys";
import { getTicketsAssignedToMe } from "../../../api/dashboard";
import { getStatusColor } from "../../CRM/shared/getTicketStatusColor";
import { useNavigate } from "react-router-dom";

const TicketsAssigned = () => {
  const navigate = useNavigate();

  const [ticketsAssigned, setTicketsAssigned] = useState([]);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [sortObj, setSortObj] = useState({
    sortType: {
      id: false,
      status: false,
      created_at: false,
    },
    sort: [],
  });

  const { data, refetch, status, isRefetching } = useQuery({
    queryFn: () =>
      getTicketsAssignedToMe({ page, pageSize, sort: sortObj.sort }),
    queryKey: [
      GET_TICKETS_ASSIGNED,
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setTicketsAssigned([]);
      setTicketsAssigned((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj, pageSize]);

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      render: (_, { id }) => (
        <span
          className="text-blue hover:underline cursor-pointer text-blue-500"
          onClick={() => navigate(`/crm/support-ticket/${id}`)}
        >
          #{id}
        </span>
      ),
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "id"),
        };
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Customer Name",
      dataIndex: "initiator.full_name",
      key: "full_name",
      render: (_, { initiator }) => initiator?.full_name,
    },
    {
      title: "Phone Number",
      dataIndex: "initiator",
      key: "phone",
    },
    {
      title: "Issue Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "created_at"),
        };
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
    },
    {
      title: "Ticket Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag className="uppercase" color={getStatusColor(status)}>
          {status.replaceAll("_", " ")}
        </Tag>
      ),
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "id"),
        };
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={ticketsAssigned?.map((item) => ({ ...item, key: item.id }))}
        loading={status === "loading"}
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
        showSorterTooltip={false}
      />
    </>
  );
};

export default TicketsAssigned;
