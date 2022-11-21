import { useQuery } from "react-query";
import { Select } from "antd";
import { GET_ORDER_ANALYTICS } from "../../../constants/queryKeys";
import { getOrderAnalytics } from "../../../api/analytics";
import { BarChart } from "../../../charts/barChart";
import { useState } from "react";
import moment from "moment/moment";

const OrderAnalytics = ({ user }) => {
  const { Option } = Select;

  const [date, setDate] = useState("this_month");

  const { data: orderAnalytics } = useQuery({
    queryFn: () => getOrderAnalytics({ user_id: user.id, date }),
    queryKey: [GET_ORDER_ANALYTICS, { user_id: user.id, date }],
  });

  const barData = orderAnalytics?.map((x, index) => ({
    id: moment(x.date).format("ll"),
    quarter: x.count,
    earnings: x.total_amount,
  }));

  return (
    <div className="col-span-2">
      <span className="flex justify-between">
        <h2 className="text-xl text-gray-700 mb-0">Order Analytics</h2>
        <Select
          defaultValue="this_month"
          style={{ width: 120 }}
          onChange={(val) => setDate(val)}
        >
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </span>

      <BarChart data={barData} />
    </div>
  );
};

export default OrderAnalytics;
