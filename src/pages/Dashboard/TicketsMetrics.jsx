import MetricsCard from "./shared/MetricsCard";

const TicketMetrics = ({ ticketMetrics }) => {
  return (
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
  );
};

export default TicketMetrics;
