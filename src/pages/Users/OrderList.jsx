import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import { Tabs } from "antd";
import OrdersList from "../Orders/OrdersList";
import { getUserOrder } from "../../api/orders";
import { IN_PROCESS, DELIVERED, CANCELLED } from "../../constants";
import { GET_USER_ORDERS } from "../../constants/queryKeys";

const OrderList = ({ user }) => {
  const { TabPane } = Tabs;

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
  const [orders, setOrders] = useState([]);

  const {
    data,
    status,
    isRefetching,
    refetch: refetchOrders,
  } = useQuery({
    queryFn: () =>
      getUserOrder({
        user: user.phone.replace("+977-", ""),
        page,
        orderStatus,
        pageSize,
      }),
    queryKey: [
      GET_USER_ORDERS,
      orderStatus + page.toString() + pageSize.toString(),
    ],
  });

  useEffect(() => {
    setOrders([]);
    if (data) setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus]);
  return (
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
          setPage={setPage}
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
          setPage={setPage}
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
          setPage={setPage}
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
          setPage={setPage}
          status={isRefetching ? "loading" : status}
        />
      </TabPane>
    </Tabs>
  );
};

export default OrderList;
