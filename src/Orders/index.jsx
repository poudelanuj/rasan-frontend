import { Tabs } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { getOrders } from "../context/OrdersContext";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;

  const { data, status } = useQuery({
    queryFn: getOrders,
    queryKey: "getOrdersList",
  });

  return (
    <div>
      <div className="text-2xl my-4">Orders</div>
      <Tabs defaultActiveKey="all">
        <TabPane key="all" tab="All">
          <OrdersList dataSource={data} status={status} />
        </TabPane>
        <TabPane key="inProcess" tab="In Progress">
          <OrdersList
            dataSource={data?.filter((order) => order.status === "in_process")}
            status={status}
          />
        </TabPane>
        <TabPane key="delivered" tab="Delivered">
          <OrdersList
            dataSource={data?.filter((order) => order.status === "delivered")}
            status={status}
          />
        </TabPane>
        <TabPane key="cancelled" tab="Cancelled">
          <OrdersList
            dataSource={data?.filter((order) => order.status === "cancelled")}
            status={status}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
