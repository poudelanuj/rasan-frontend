import React, { useState } from "react";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import { CustomCard } from "../../../components/customCard";
import { useQuery } from "react-query";
import ColumnPlot from "../../../charts/ColumnPlot";
import { getOrderAnalytics } from "../../../api/analytics";
import { GET_ORDER_ANALYTICS } from "../../../constants/queryKeys";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";

const ProductAnalytics = ({ product_id }) => {
  const [orderDate, setOrderDate] = useState("this_month");

  const { data: orderAnalytics } = useQuery({
    queryFn: () => getOrderAnalytics({ product_id, date: orderDate }),
    queryKey: [GET_ORDER_ANALYTICS, { product_id, date: orderDate }],
  });

  const columnPlotData = orderAnalytics?.map((x) => ({
    id: moment(x.date).format("ll"),
    type: moment(x.date).format("ll"),
    count: x.count,
    sales: x.total_amount,
  }));

  return (
    <React.Fragment>
      <h2 className="text-xl text-text mb-8">Product Analytics</h2>
      <CustomCard className="col-span-2">
        <span className="flex justify-between items-center mb-4">
          <p className="text-xl text-text mb-0">Order</p>

          <AnalysisTimeSelector onChange={setOrderDate} />
        </span>
        <div style={{ height: 500 }}>
          {!isEmpty(orderAnalytics) ? (
            <ColumnPlot data={columnPlotData} />
          ) : (
            <Empty />
          )}
        </div>
      </CustomCard>
    </React.Fragment>
  );
};

export default ProductAnalytics;
