import {
  DELIVERED,
  IN_PROCESS,
  CANCELLED_BY_CSR,
  CANCELLED_REQUESTED,
  DELIVERY_RETURNED,
  CONFIRMED_BY_CSR,
  ON_THE_WAY_TO_DELIVERY,
  ON_HOLD,
  ARCHIVED,
} from "../constants";

const statusColor = (status) => {
  switch (status) {
    case IN_PROCESS:
    case DELIVERY_RETURNED:
    case CANCELLED_REQUESTED:
    case ON_HOLD:
      return "orange";
    case CANCELLED_BY_CSR:
    case ARCHIVED:
      return "red";
    case DELIVERED:
    case CONFIRMED_BY_CSR:
    case ON_THE_WAY_TO_DELIVERY:
      return "green";
    default:
      return "green";
  }
};

export default statusColor;
