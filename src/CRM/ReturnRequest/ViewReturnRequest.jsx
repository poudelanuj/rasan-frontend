import { Descriptions, Divider, Tag } from "antd";
import moment from "moment";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getTicket } from "../../api/crm/tickets";
import { GET_TICKET } from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import { getStatusColor } from "../shared/getTicketStatusColor";

const ViewReturnRequest = () => {
  const { ticketId } = useParams();
  const [searchParam] = useSearchParams();
  const pageHeaderPath = searchParam.get("path");

  const { data: ticket, status } = useQuery({
    queryFn: () => getTicket(ticketId),
    queryKey: [GET_TICKET, ticketId],
    enabled: !!ticketId,
  });

  return (
    <>
      {status === "loading" && <Loader isOpen />}

      <div className="mt-4">
        <CustomPageHeader
          path={pageHeaderPath || "../"}
          title={`Return Ticket #${ticketId}`}
        />
      </div>
      <div className="flex mt-5 font-medium justify-between items-center">
        <span>{moment(ticket?.created_at).format("MMMM Do YYYY, h:mm a")}</span>
        <span>Order Id: #{ticket?.order}</span>
      </div>
      <Divider />

      <div className="flex flex-wrap gap-5 p-5 w-fit border rounded bg-white">
        <img alt="" className="h-[100px] rounded" src="/gallery-icon.svg" />
        <img alt="" className="h-[100px] rounded" src="/rasan-default.png" />
      </div>

      <Descriptions
        className="my-5 p-5 bg-white rounded"
        column={2}
        title="Ticket Details"
      >
        <Descriptions.Item label="Title" span={2}>
          {ticket?.title}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {ticket?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={2}>
          <Tag color={getStatusColor(ticket?.status)}>{ticket?.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Customer Name">
          {ticket?.initiator}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {ticket?.initiator}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ViewReturnRequest;
