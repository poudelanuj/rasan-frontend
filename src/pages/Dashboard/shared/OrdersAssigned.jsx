import { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import { Table, Tag, Input } from "antd";
import moment from "moment";
import { getOrdersAssignedToMe } from "../../../api/dashboard";
import { GET_ORDERS_ASSIGNED } from "../../../constants/queryKeys";
import { useNavigate } from "react-router-dom";
import { capitalize, uniqBy } from "lodash";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../../constants";

const OrdersAssigned = () => {
  const navigate = useNavigate();

  const getTagColor = (status) => {
    switch (status) {
      case IN_PROCESS:
        return "orange";
      case CANCELLED:
        return "red";
      case DELIVERED:
        return "green";
      default:
        return "green";
    }
  };

  let timeout = 0;

  const searchInput = useRef();

  const [pageSize, setPageSize] = useState(20);

  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState([]);

  const [sortObj, setSortObj] = useState({
    sortType: {
      created_at: false,
      total_paid_amount: false,
    },
    sort: [],
  });

  const {
    data,
    status,
    refetch: refetchOrders,
    isRefetching,
  } = useQuery({
    queryFn: () =>
      getOrdersAssignedToMe({
        page,
        status: "all",
        pageSize,
        sort: sortObj.sort,
        search: searchInput.current,
      }),
    queryKey: [
      GET_ORDERS_ASSIGNED,
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setOrders([]);
      setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj, pageSize]);

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [
        `${sortObj.sortType[name] ? "" : "-"}${
          header.dataIndex === "id" ? "created_at" : header.dataIndex
        }`,
      ],
    });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "orderId",
      render: (_, { id, status }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/orders/view-order/${id}`)}
          >
            #{id}
          </div>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "created_at"),
        };
      },
    },
    {
      title: "Customer",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      render: (_, { phone, customer_name, id }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/orders/view-order/${id}`)}
          >
            {customer_name ? `${customer_name} (${phone})` : phone}
          </div>
        );
      },
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_paid_amount",
      key: "total_paid_amount",
      render: (_, { total_paid_amount }) => {
        return <>Rs. {total_paid_amount}</>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "total_paid_amount"),
        };
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <Tag color={getTagColor(status)}>
            {status.toUpperCase().replaceAll("_", " ")}
          </Tag>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "status"),
        };
      },
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
      render: (_, { payment }) => {
        return <>{capitalize(payment?.payment_method?.replaceAll("_", " "))}</>;
      },
    },
    {
      title: "Shop Name",
      dataIndex: "shop_name",
      key: "shop_name",
      width: "15%",
      render: (_, { shop_name }) => (
        <span className="w-16" style={{ overflowWrap: "anywhere" }}>
          {capitalize(shop_name?.replaceAll("_", " "))}
        </span>
      ),
    },
    {
      title: "Ordered At",
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
  ];

  return (
    <div className="">
      <Input.Search
        className="mb-4"
        enterButton="Search"
        placeholder="Search user, contact, shop"
        size="large"
        onChange={(e) => {
          searchInput.current = e.target.value;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(refetchOrders, 400);
        }}
      />

      <Table
        columns={columns}
        dataSource={orders?.map((item) => ({ ...item, key: item.id }))}
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
    </div>
  );
};

export default OrdersAssigned;
