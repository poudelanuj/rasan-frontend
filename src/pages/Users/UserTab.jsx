import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import { Tabs } from "antd";
import OrdersList from "../Orders/OrdersList";
import UserInformation from "./UserInformation";
import { getAssignedOrder } from "../../api/orders";
import { IN_PROCESS, DELIVERED, CANCELLED } from "../../constants";
import { GET_ASSIGNED_ORDERS } from "../../constants/queryKeys";
const { TabPane } = Tabs;

const UserTab = ({ user }) => {
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
    queryFn: () => getAssignedOrder({ page, orderStatus, pageSize }),
    queryKey: [
      GET_ASSIGNED_ORDERS,
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
    <Tabs className="bg-white !px-6" defaultActiveKey="1">
      <TabPane key="1" tab="User Information">
        <UserInformation user={user} />
      </TabPane>
      <TabPane key="2" tab="Order Details">
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
      </TabPane>
      <TabPane key="3" tab="User Basket">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  );
};

export default UserTab;
