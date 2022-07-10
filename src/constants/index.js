const colors = {
  primary: "#00A0B0",
};
const siteInformation = {
  base_url: "http://159.65.145.153:8000",
};
export { colors, siteInformation };

export const COMING_SOON_IMAGE =
  "https://motoworldnepal.com/wp-content/uploads/2022/06/coming-soon-2579123_960_720.jpg";

export const IN_PROCESS = "in_process";
export const CANCELLED = "cancelled";
export const DELIVERED = "completed";

export const TICKET_STATUS_NEW = "new";
export const TICKET_STATUS_PROCESSING = "processing";
export const TICKET_STATUS_CLOSED = "closed";
export const TICKET_STATUS_ONHOLD = "on_hold";

export const TICKET_STATUS = [
  TICKET_STATUS_NEW,
  TICKET_STATUS_PROCESSING,
  TICKET_STATUS_CLOSED,
  TICKET_STATUS_ONHOLD,
];

export const TICKET_TYPE_GENERAL = "general";
export const TICKET_TYPE_RETURN = "return_request";
export const TICKET_TYPE_CANCEL = "cancel_order";
export const TICKET_TYPE_OTHER = "other";

export const TICKET_TYPES = [
  TICKET_TYPE_GENERAL,
  TICKET_TYPE_RETURN,
  TICKET_TYPE_CANCEL,
  TICKET_TYPE_OTHER,
];
