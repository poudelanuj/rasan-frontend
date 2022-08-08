import { Tabs } from "antd";
import { uniqBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getPaginatedOrders } from "../../api/orders";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import { GET_PAGINATED_ORDERS } from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import OrdersList from "./OrdersList";

const Orders = () => {
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
    queryFn: () => getPaginatedOrders({ page, orderStatus, size: pageSize }),
    queryKey: [
      GET_PAGINATED_ORDERS,
      orderStatus + page.toString() + pageSize.toString(),
    ],
  });

  useEffect(() => {
    if (data) setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus]);

  return (
    <div>
      <CustomPageHeader title="Orders" isBasicHeader />

      <Tabs
        defaultActiveKey="all"
        onTabClick={(tabKey) => setOrderStatus(tabKey)}
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
        <TabPane key={IN_PROCESS} tab="In Progress">
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
    </div>
  );
};

export default Orders;
