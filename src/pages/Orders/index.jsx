import { Tabs } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import { getOrders } from "../../context/OrdersContext";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;

  const { data, status, isRefetching, refetch } = useQuery({
    queryFn: getOrders,
    queryKey: "getOrdersList",
  });

  return (
    <div>
      <div className="text-2xl my-4">Orders</div>
      <Tabs defaultActiveKey="all">
        <TabPane key="all" tab="All">
          <OrdersList
            dataSource={data}
            refetchOrders={refetch}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="inProcess" tab="In Progress">
          <OrdersList
            dataSource={data?.filter((order) => order.status === IN_PROCESS)}
            refetchOrders={refetch}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="delivered" tab="Delivered">
          <OrdersList
            dataSource={data?.filter((order) => order.status === DELIVERED)}
            refetchOrders={refetch}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="cancelled" tab="Cancelled">
          <OrdersList
            dataSource={data?.filter((order) => order.status === CANCELLED)}
            refetchOrders={refetch}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
