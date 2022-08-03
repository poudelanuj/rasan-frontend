import { Tabs } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import { getOrders } from "../../context/OrdersContext";
import CustomPageHeader from "../../shared/PageHeader";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;

  const {
    data,
    status,
    isRefetching,
    refetch: refetchOrders,
  } = useQuery({
    queryFn: getOrders,
    queryKey: "getOrdersList",
  });

  return (
    <div>
      <CustomPageHeader title="Orders" isBasicHeader />

      <Tabs defaultActiveKey="all">
        <TabPane key="all" tab="All">
          <OrdersList
            dataSource={data}
            refetchOrders={refetchOrders}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="inProcess" tab="In Progress">
          <OrdersList
            dataSource={data?.filter((order) => order.status === IN_PROCESS)}
            refetchOrders={refetchOrders}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="delivered" tab="Delivered">
          <OrdersList
            dataSource={data?.filter((order) => order.status === DELIVERED)}
            refetchOrders={refetchOrders}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
        <TabPane key="cancelled" tab="Cancelled">
          <OrdersList
            dataSource={data?.filter((order) => order.status === CANCELLED)}
            refetchOrders={refetchOrders}
            status={isRefetching ? "loading" : status}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
