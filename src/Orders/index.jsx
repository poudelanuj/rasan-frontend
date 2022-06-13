import { Tabs } from "antd";
import React from "react";
import { getOrders } from "../mock/orders";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;
  return (
    <div>
      <div className="text-2xl my-4">Orders</div>
      <Tabs defaultActiveKey="all">
        <TabPane key="all" tab="All">
          <OrdersList dataSource={getOrders(20)} />
        </TabPane>
        <TabPane key="inProgress" tab="In Progress">
          <OrdersList
            dataSource={getOrders(20).filter(
              (order) => order.status === "in progress"
            )}
          />
        </TabPane>
        <TabPane key="delivered" tab="Delivered">
          <OrdersList
            dataSource={getOrders(20).filter(
              (order) => order.status === "delivered"
            )}
          />
        </TabPane>
        <TabPane key="cancelled" tab="Cancelled">
          <OrdersList
            dataSource={getOrders(20).filter(
              (order) => order.status === "cancelled"
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
