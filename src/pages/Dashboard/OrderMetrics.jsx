import MetricsCard from "./shared/MetricsCard";

const OrderMetrics = ({ orderMetrics }) => {
  return (
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
  );
};

export default OrderMetrics;
