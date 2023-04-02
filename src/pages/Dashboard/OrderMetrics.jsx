import MetricsCard from "./shared/MetricsCard";

const OrderMetrics = ({ orderMetrics }) => {
  return (
    <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
      <MetricsCard
        content={orderMetrics?.total_orders_created}
        title="Total orders"
      />

      <MetricsCard
        content={orderMetrics?.total_orders_completed}
        title="Total orders delivered"
      />

      <MetricsCard content={orderMetrics?.total_users} title="Total users" />

      <MetricsCard
        content={
          "Rs. " +
          new Intl.NumberFormat("en-IN").format(
            orderMetrics?.total_orders_amount
          )
        }
        title="Total orders amount"
      />

      <MetricsCard
        content={
          "Rs. " +
          new Intl.NumberFormat("en-IN").format(
            orderMetrics?.total_processed_orders_amount
          )
        }
        title="Total processed order amount"
      />

      <MetricsCard
        content={orderMetrics?.orders_assigned_to_me}
        title="Orders assigned to me"
      />

      <MetricsCard
        content={orderMetrics?.orders_completed_by_me}
        title="Orders completed by me"
      />
    </div>
  );
};

export default OrderMetrics;
