import { Card, Select, Space } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getTicketMetrics } from "../../api/crm/tickets";
import { getOrderMetrics } from "../../api/orders";
import { getEndUser } from "../../api/users";
import { useAuth } from "../../AuthProvider";
import {
  GET_ORDERS_ASSIGNED,
  GET_ORDER_METRICS,
  GET_TICKETS_ASSIGNED,
  GET_TICKET_METRICS,
} from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import WelcomeCard from "./shared/WelcomeCard";
import { DASHBOARD_TIME_KEYS } from "../../constants";
import {
  getOrdersAssignedToMe,
  getTicketsAssignedToMe,
} from "../../api/dashboard";
import TicketsAssigned from "./shared/TicketsAssigned";
import OrdersAssigned from "./shared/OrdersAssigned";
import OrderMetrics from "./OrderMetrics";
import TicketMetrics from "./TicketsMetrics";
import { capitalize } from "lodash";

const Dashboard = () => {
  const { logout } = useAuth();
  const [ticketTimeKey, setTicketTimeKey] = useState(
    DASHBOARD_TIME_KEYS[0].value
  );
  const [orderTimeKey, setOrderTimeKey] = useState(
    DASHBOARD_TIME_KEYS[0].value
  );

  const { data: orderMetrics, status: orderMetricsStatus } = useQuery({
    queryFn: () => getOrderMetrics(orderTimeKey),
    queryKey: [GET_ORDER_METRICS, orderTimeKey],
  });

  const { data: ticketMetrics, status: ticketsMetricsStatus } = useQuery({
    queryFn: () => getTicketMetrics(ticketTimeKey),
    queryKey: [GET_TICKET_METRICS, ticketTimeKey],
  });

  const { data: ticketsAssigned, status: ticketsAssignedStatus } = useQuery({
    queryFn: getTicketsAssignedToMe,
    queryKey: GET_TICKETS_ASSIGNED,
  });

  const { data: ordersAssigned, status: ordersAssignedStatus } = useQuery({
    queryFn: getOrdersAssignedToMe,
    queryKey: GET_ORDERS_ASSIGNED,
  });

  const { data: userInfo } = useQuery(["get-end-user"], getEndUser, {
    retry: false,
    onError: (err) => {
      logout();
    },
  });

  return (
    <>
      {(orderMetricsStatus === "loading" ||
        ticketsMetricsStatus === "loading") && <Loader isOpen />}

      <div className="py-4">
        <div>
          <h2 className="text-2xl mb-6 text-gray-600">Dashboard</h2>
        </div>

        <div className="flex gap-3">
          <WelcomeCard
            avatar={userInfo?.profile_picture?.thumbnail}
            contact={userInfo?.phone || userInfo?.alternate_phone}
            group={
              JSON.parse(localStorage.getItem("groups") || "[]")?.[0]?.name ||
              "unknown"
            }
            title={`Welcome ${userInfo?.full_name?.split(" ")[0]}`}
          />

          <div className="grow flex flex-col gap-3">
            <Card bodyStyle={{ padding: 10 }} className="grow">
              <div className="flex mb-2 justify-between items-center">
                <h4 className="m-0">Tickets</h4>
                <Space>
                  <Select
                    defaultValue={DASHBOARD_TIME_KEYS[0].value}
                    loading={ticketsMetricsStatus === "loading"}
                    size="small"
                    style={{ width: 120 }}
                    onChange={(value) => setTicketTimeKey(value)}
                  >
                    {DASHBOARD_TIME_KEYS.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {capitalize(item.name)}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              </div>

              <TicketMetrics ticketMetrics={ticketMetrics} />
            </Card>
            <Card bodyStyle={{ padding: 10 }} className="grow">
              <div className="flex mb-2 justify-between items-center">
                <h4 className="m-0">Orders</h4>
                <Space>
                  <Select
                    defaultValue={DASHBOARD_TIME_KEYS[0].value}
                    loading={orderMetricsStatus === "loading"}
                    size="small"
                    style={{ width: 120 }}
                    onChange={(value) => setOrderTimeKey(value)}
                  >
                    {DASHBOARD_TIME_KEYS.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {capitalize(item.name)}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              </div>

              <OrderMetrics orderMetrics={orderMetrics} />
            </Card>
          </div>
        </div>

        <h3 className="text-xl mt-8">My Orders</h3>
        <OrdersAssigned orders={ordersAssigned} status={ordersAssignedStatus} />

        <h3 className="text-xl mt-8">My Tickets</h3>
        <TicketsAssigned
          status={ticketsAssignedStatus}
          tickets={ticketsAssigned}
        />
      </div>
    </>
  );
};

export default Dashboard;
