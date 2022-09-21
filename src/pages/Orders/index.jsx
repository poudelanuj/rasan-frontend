import { Tabs } from "antd";
import React from "react";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import {
  GET_CANCELLED_ORDER,
  GET_DELIVERED_ORDER,
  GET_INPROCESS_ORDER,
  GET_ORDERS,
} from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import OrdersList from "./OrdersList";

const Orders = () => {
  const { TabPane } = Tabs;

  return (
    <div>
      <CustomPageHeader title="Orders" isBasicHeader />

      <Tabs defaultActiveKey="all">
        <TabPane key="all" tab="All">
          <OrdersList queryKey={GET_ORDERS} status={""} />
        </TabPane>
        <TabPane key="inProcess" tab="In Process">
          <OrdersList queryKey={GET_INPROCESS_ORDER} status={IN_PROCESS} />
        </TabPane>
        <TabPane key="delivered" tab="Delivered">
          <OrdersList queryKey={GET_DELIVERED_ORDER} status={DELIVERED} />
        </TabPane>
        <TabPane key="cancelled" tab="Cancelled">
          <OrdersList queryKey={GET_CANCELLED_ORDER} status={CANCELLED} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Orders;
