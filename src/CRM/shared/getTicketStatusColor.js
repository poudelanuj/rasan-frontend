import {
  TICKET_STATUS_CLOSED,
  TICKET_STATUS_NEW,
  TICKET_STATUS_ONHOLD,
  TICKET_STATUS_PROCESSING,
} from "../../constants";

export const getStatusColor = (status) => {
  switch (status) {
    case TICKET_STATUS_NEW:
      return "green";
    case TICKET_STATUS_PROCESSING:
      return "orange";
    case TICKET_STATUS_CLOSED:
      return "grey";
    case TICKET_STATUS_ONHOLD:
      return "red";
    default:
      break;
  }
};
