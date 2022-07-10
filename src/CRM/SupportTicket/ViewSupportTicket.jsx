import { Descriptions, Divider, Image, Tag, Button } from "antd";
import moment from "moment";
import { useQuery } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getTicket } from "../../api/crm/tickets";
import { GET_TICKET } from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import { getStatusColor } from "../shared/getTicketStatusColor";

const ViewSupportTicket = () => {
  const navigate = useNavigate();
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

      <div className="mt-4 flex items-center justify-between">
        <CustomPageHeader
          path={pageHeaderPath || "../"}
          title={`Support Ticket #${ticketId}`}
        />
        <Button type="primary" onClick={() => navigate(`../edit/${ticketId}`)}>
          Edit
        </Button>
      </div>
      <div className="flex mt-5 font-medium justify-between items-center">
        <span>{moment(ticket?.created_at).format("MMMM Do YYYY, h:mm a")}</span>
      </div>
      <Divider />

      <div className="flex flex-wrap gap-5 w-fit">
        {ticket?.images?.map((image) => (
          <div key={image} className="bg-white border rounded p-2 flex">
            <Image height={100} src={image.image.thumbnail} />
          </div>
        ))}

        {!ticket?.images?.length && (
          <div className="p-2 border bg-white rounded">
            <img alt="" className="h-[100px]" src="/rasan-default.png" />
          </div>
        )}
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
          {ticket?.initiator?.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {ticket?.initiator?.phone}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ViewSupportTicket;
