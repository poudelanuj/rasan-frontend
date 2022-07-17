import { Card } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { getTicketMetrics } from "../../api/crm/tickets";
import { getOrderMetrics } from "../../api/orders";
import { getEndUser } from "../../api/users";
import { useAuth } from "../../AuthProvider";
import {
  GET_ORDER_METRICS,
  GET_TICKET_METRICS,
} from "../../constants/queryKeys";
import { getOrders } from "../../context/OrdersContext";
import SupportTicketList from "../../CRM/SupportTicket/SupportTicketList";
import OrdersList from "../../Orders/OrdersList";
import Loader from "../../shared/Loader";
import MetricsCard from "./shared/MetricsCard";
import WelcomeCard from "./shared/WelcomeCard";

const Dashboard = () => {
  const { logout } = useAuth();

  const { data, status } = useQuery({
    queryFn: getOrders,
    queryKey: "getOrdersList",
  });

  const { data: orderMetrics, status: orderMetricsStatus } = useQuery({
    queryFn: getOrderMetrics,
    queryKey: GET_ORDER_METRICS,
  });

  const { data: ticketMetrics, status: ticketsMetricsStatus } = useQuery({
    queryFn: getTicketMetrics,
    queryKey: GET_TICKET_METRICS,
  });

  const { data: userInfo, status: userStatus } = useQuery(
    ["get-end-user"],
    getEndUser,
    {
      retry: false,
      onError: (err) => {
        logout();
      },
    }
  );

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
              <h4>Tickets</h4>

              <div className="flex gap-3 flex-wrap">
                <MetricsCard
                  content={ticketMetrics?.total_tickets_created}
                  title="Total Tickets Created"
                />

                <MetricsCard
                  content={ticketMetrics?.tickets_assigned_to_me}
                  title="Tickets assigned to me"
                />

                <MetricsCard
                  content={ticketMetrics?.tickets_closed_by_me}
                  title="Tickets closed by me"
                />

                <MetricsCard
                  content={ticketMetrics?.total_tickets_closed}
                  title="Total Tickets Closed"
                />
              </div>
            </Card>
            <Card bodyStyle={{ padding: 10 }} className="grow">
              <h4>Orders</h4>

              <div className="flex gap-3 flex-wrap">
                <MetricsCard
                  content={orderMetrics?.total_orders_created}
                  title="Total Orders Created"
                />

                <MetricsCard
                  content={orderMetrics?.orders_assigned_to_me}
                  title="Orders assigned to me"
                />

                <MetricsCard
                  content={orderMetrics?.orders_completed_by_me}
                  title="Orders completed by me"
                />

                <MetricsCard
                  content={orderMetrics?.total_orders_completed}
                  title="Total Orders Completed"
                />
              </div>
            </Card>
          </div>
        </div>

        <h3 className="text-xl mt-8">Orders</h3>
        <OrdersList
          dataSource={data}
          showActions={false}
          showHeaderButtons={false}
          status={status}
        />

        <h3 className="text-xl">Tickets</h3>
        <SupportTicketList isForDashboard />
      </div>
    </>
  );
};

export default Dashboard;
