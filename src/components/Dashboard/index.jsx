import { Avatar, Card, Space } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { colors } from "../../constants";
import { getOrders } from "../../context/OrdersContext";
import SupportTicketList from "../../CRM/SupportTicket/SupportTicketList";
import OrdersList from "../../Orders/OrdersList";

const Dashboard = () => {
  const { data, status } = useQuery({
    queryFn: getOrders,
    queryKey: "getOrdersList",
  });

  return (
    <div className="py-4">
      <div>
        <h2 className="text-2xl mb-6 text-gray-600">Dashboard</h2>
      </div>

      <div className="flex gap-3">
        <Card
          bodyStyle={{ paddingBottom: 50 }}
          className="w-[300px]"
          headStyle={{ backgroundColor: colors.primary }}
          title={<div className="text-gray-50 ml-20">Welcome Biplab</div>}
        >
          <div className="absolute bottom-[180px] p-1 bg-gray-100 rounded-full w-fit">
            <Avatar size={60} src="https://joeschmoe.io/api/v1/random" />
          </div>

          <div className="relative top-10 bg-gray-50 rounded p-2 px-4">
            <div>
              <small className="text-gray-400">Contact</small>
              <div className="text-gray-700 font-medium">+977 9867461150</div>
            </div>
            <div className="mt-4">
              <small className="text-gray-400">Group</small>
              <div className="text-gray-700 font-medium">+977 9867461150</div>
            </div>
          </div>
        </Card>
        <div className="grow flex flex-col gap-3">
          <Card bodyStyle={{ padding: 10 }} className="grow">
            <h4>Tickets</h4>

            <div className="flex gap-3">
              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Total Tickets Created</small>
                <h4 className="text-xl">200</h4>
              </Card>

              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Tickets assigned to me</small>
                <h4 className="text-xl">200</h4>
              </Card>

              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Tickets solved by me</small>
                <h4 className="text-xl">200</h4>
              </Card>
            </div>
          </Card>
          <Card bodyStyle={{ padding: 10 }} className="grow">
            <h4>Orders</h4>

            <div className="flex gap-3">
              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Orders Created</small>
                <h4 className="text-xl">200</h4>
              </Card>

              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Orders Assigned</small>
                <h4 className="text-xl">200</h4>
              </Card>

              <Card
                bodyStyle={{
                  padding: 10,
                  backgroundColor: colors.light,
                  borderRadius: 4,
                }}
                bordered={false}
                className="grow"
              >
                <small className="text-gray-500">Orders Solved</small>
                <h4 className="text-xl">200</h4>
              </Card>
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
  );
};

export default Dashboard;
