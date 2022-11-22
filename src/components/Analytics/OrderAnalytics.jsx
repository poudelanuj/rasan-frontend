import { useState } from "react";
import { useQuery } from "react-query";
import { isEmpty } from "lodash";
import { Empty } from "antd";
import { GET_ORDER_ANALYTICS } from "../../constants/queryKeys";
import { getOrderAnalytics } from "../../api/analytics";
import moment from "moment";
import ColumnPlot from "../../charts/ColumnPlot";
import { CustomCard } from "../CustomCard";
import { AnalysisTimeSelector } from "../AnalysisTimeSelector";

const OrderAnalytics = ({
  user_id,
  address,
  brand_id,
  category_id,
  product_id,
  product_sku_id,
}) => {
  const [date, setDate] = useState("this_month");

  const { data: orderAnalytics } = useQuery({
    queryFn: () =>
      getOrderAnalytics({
        user_id,
        address,
        brand_id,
        category_id,
        product_id,
        product_sku_id,
        date,
      }),
    queryKey: [
      GET_ORDER_ANALYTICS,
      {
        user_id,
        address,
        brand_id,
        category_id,
        product_id,
        product_sku_id,
        date,
      },
    ],
  });

  const columnPlotData = orderAnalytics?.map((x) => ({
    id: moment(x.date).format("ll"),
    type: moment(x.date).format("ll"),
    count: x.count,
    sales: x.total_amount,
  }));

  return (
    <CustomCard className="col-span-2">
      <span className="flex justify-between mb-4">
        <h2 className="text-xl text-gray-700 mb-0">Order</h2>
        <AnalysisTimeSelector onChange={setDate} />
      </span>

      {!isEmpty(orderAnalytics) ? (
        <ColumnPlot data={columnPlotData} />
      ) : (
        <Empty />
      )}
    </CustomCard>
  );
};

export default OrderAnalytics;
