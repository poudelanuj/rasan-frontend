import { Tabs } from "antd";
import { uniqBy } from "lodash";
import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { getPaginatedOrders } from "../../api/orders";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import { GET_PAGINATED_ORDERS } from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;

  const searchInput = useRef();

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
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
    isRefetching,
    refetch: refetchOrders,
  } = useQuery({
    queryFn: () =>
      getPaginatedOrders({
        page,
        orderStatus,
        size: pageSize,
        sort: sortObj.sort,
        search: searchInput.current,
      }),
    queryKey: [
      GET_PAGINATED_ORDERS,
      orderStatus + page.toString() + pageSize.toString(),
      sortObj.sort,
      searchInput.current,
    ],
  });

  useEffect(() => {
    setOrders([]);
    if (data) setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus, sortObj]);

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

  return (
    <div>
      <CustomPageHeader title="Orders" isBasicHeader />

      <Tabs
        defaultActiveKey="all"
        onTabClick={(tabKey) => {
          setPage(1);
          setOrderStatus(tabKey);
        }}
      >
        <TabPane key="all" tab="All">
          <OrdersList
            dataSource={orders}
            ordersCount={data?.count}
            page={page}
            pageSize={pageSize}
            refetchOrders={refetchOrders}
            searchInput={searchInput}
            setPage={setPage}
            sortingFn={sortingFn}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key={IN_PROCESS} tab="In Process">
          <OrdersList
            dataSource={orders}
            ordersCount={data?.count}
            page={page}
            pageSize={pageSize}
            refetchOrders={refetchOrders}
            searchInput={searchInput}
            setPage={setPage}
            sortingFn={sortingFn}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key={DELIVERED} tab="Delivered">
          <OrdersList
            dataSource={orders}
            ordersCount={data?.count}
            page={page}
            pageSize={pageSize}
            refetchOrders={refetchOrders}
            searchInput={searchInput}
            setPage={setPage}
            sortingFn={sortingFn}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key={CANCELLED} tab="Cancelled">
          <OrdersList
            dataSource={orders}
            ordersCount={data?.count}
            page={page}
            pageSize={pageSize}
            refetchOrders={refetchOrders}
            searchInput={searchInput}
            setPage={setPage}
            sortingFn={sortingFn}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
