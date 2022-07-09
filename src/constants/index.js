const colors = {
  primary: "#00A0B0",
};
const siteInformation = {
  base_url: "http://159.65.145.153:8000",
};
export { colors, siteInformation };

export const IN_PROCESS = "in_process";
export const CANCELLED = "cancelled";
export const DELIVERED = "completed";

export const TICKET_STATUS_NEW = "new";
export const TICKET_STATUS_PROCESSING = "processing";
export const TICKET_STATUS_CLOSED = "closed";
export const TICKET_STATUS_ONHOLD = "on_hold";

export const TICKET_TYPE_GENERAL = "general";
export const TICKET_TYPE_RETURN = "return_request";
export const TICKET_TYPE_CANCEL = "cancel_order";
export const TICKET_TYPE_OTHER = "other";
