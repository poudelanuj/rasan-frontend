import { useState } from "react";
import { useQuery } from "react-query";
import { isEmpty } from "lodash";
import { Empty } from "antd";
import { GET_ORDER_ANALYTICS } from "../../../constants/queryKeys";
import { getOrderAnalytics } from "../../../api/analytics";
import moment from "moment";
import ColumnPlot from "../../../charts/ColumnPlot";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";

const OrderAnalytics = ({ user }) => {
  const [date, setDate] = useState("this_month");

  const { data: orderAnalytics } = useQuery({
    queryFn: () => getOrderAnalytics({ user_id: user.id, date }),
    queryKey: [GET_ORDER_ANALYTICS, { user_id: user.id, date }],
  });

  const columnPlotData = orderAnalytics?.map((x) => ({
    id: moment(x.date).format("ll"),
    type: moment(x.date).format("ll"),
    count: x.count,
    sales: x.total_amount,
  }));

  return (
    <div className="col-span-2">
      <span className="flex justify-between">
        <h2 className="text-xl text-gray-700 mb-0">Order Analytics</h2>
        <AnalysisTimeSelector onChange={setDate} />
      </span>

      {!isEmpty(orderAnalytics) ? (
        <ColumnPlot data={columnPlotData} />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default OrderAnalytics;
