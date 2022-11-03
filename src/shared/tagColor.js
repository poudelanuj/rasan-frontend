import {
  DELIVERED,
  IN_PROCESS,
  CANCELLED_BY_CSR,
  CANCELLED_BY_CUSTOMER,
  DELIVERY_RETURNED,
  CONFIRMED_BY_CSR,
  ON_THE_WAY_TO_DELIVERY,
  ON_HOLD,
} from "../constants";

const statusColor = (status) => {
  switch (status) {
    case IN_PROCESS:
    case DELIVERY_RETURNED:
    case ON_HOLD:
      return "orange";
    case CANCELLED_BY_CSR:
    case CANCELLED_BY_CUSTOMER:
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
