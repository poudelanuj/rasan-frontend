import { useState } from "react";
import moment from "moment";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import ColumnPlot from "../../../charts/ColumnPlot";
import { CustomCard } from "../../../components/customCard";
import { useQuery } from "react-query";
import { getOrderAnalytics } from "../../../api/analytics";
import { GET_ORDER_ANALYTICS } from "../../../constants/queryKeys";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";

const ProductSkuAnalytics = ({ product_sku_id }) => {
  const [orderDate, setOrderDate] = useState("this_month");

  const { data: orderAnalytics } = useQuery({
    queryFn: () => getOrderAnalytics({ product_sku_id, date: orderDate }),
    queryKey: [GET_ORDER_ANALYTICS, { product_sku_id, date: orderDate }],
  });

  const columnPlotData = orderAnalytics?.map((x) => ({
    id: moment(x.date).format("ll"),
    type: moment(x.date).format("ll"),
    count: x.count,
    sales: x.total_amount,
  }));

  return (
    <div className="p-6 rounded-lg flex flex-col gap-2">
      <h2 className="text-xl">Product SKU Analytics</h2>
      <div className="grid grid-cols-3 gap-x-10 mb-10">
        <CustomCard className="col-span-2">
          <span className="flex justify-between mb-4">
            <h2 className="text-xl">Order</h2>

            <AnalysisTimeSelector onChange={setOrderDate} />
          </span>

          <div className="h-auto" style={{ height: 400 }}>
            {!isEmpty(orderAnalytics) ? (
              <ColumnPlot data={columnPlotData} />
            ) : (
              <Empty />
            )}
          </div>
        </CustomCard>
      </div>

      <div className="grid grid-cols-3 gap-x-10 mb-10">
        <CustomCard className="col-span-2">
          <span className="flex justify-between">
            <h2 className="text-xl">Inventory</h2>
            <AnalysisTimeSelector onChange={setOrderDate} />
          </span>
          <div className="h-fit" style={{ height: 400 }}>
            <>Line Chart here</>
          </div>
        </CustomCard>
      </div>
    </div>
  );
};

export default ProductSkuAnalytics;
