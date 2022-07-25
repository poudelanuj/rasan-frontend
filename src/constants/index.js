const colors = {
  primary: "#00A0B0",
  light: "#F6FAFF",
  notification_sent: "#9EEAEC",
  notification_clicked: "#A3C1FB",
  notification_seen: "#FFEAAC",
};
const siteInformation = {
  base_url: "http://159.65.145.153:8000",
};
export const ORDER_INVOICE_URL =
  siteInformation.base_url + "/api/order/admin/order/invoice/{ORDER_ID}/";

export { colors, siteInformation };

export const DEFAULT_CARD_IMAGE =
  "https://fisnikde.com/wp-content/uploads/2019/01/broken-image.png";

export const COMING_SOON_IMAGE =
  "https://motoworldnepal.com/wp-content/uploads/2022/06/coming-soon-2579123_960_720.jpg";

export const IN_PROCESS = "in_process";
export const CANCELLED = "cancelled";
export const DELIVERED = "completed";

export const BANK_DEPOSIT = "bank_deposit";
export const REDEEM = "redeem";
export const PAYMENT_STATUS = ["unverified", "unpaid", "paid"];
export const PAYMENT_METHODS = [
  "cips",
  "esewa",
  "khalti",
  "bank_deposit",
  "redeem",
  "cash_on_delivery",
];

export const ORDER_TYPE_LOYALTY_REDEEM = "loyalty_redeem";
export const ORDER_TYPES = ["loyalty_redeem", "general"];

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

export const NOTIFICATION_STATUS = ["pending", "seen", "clicked"];
export const NOTIFICATION_TYPES = [
  {
    name: "promotion",
    value: "offer",
  },
  {
    name: "tutorial",
    value: "notice",
  },
  {
    name: "general_info",
    value: "general_info",
  },
  {
    name: "user_business_intelligence",
    value: "user_business_intelligence",
  },
  {
    name: "market_intelligence",
    value: "market_intelligence",
  },
];

export const NOTIFICATION_DESTINATION_TYPES = ["offer", "notice"];

export const DASHBOARD_TIME_KEYS = [
  {
    name: "last 24 hours",
    value: "last_24_hrs",
  },
  {
    name: "last week",
    value: "last_7_days",
  },
  {
    name: "last month",
    value: "last_30_days",
  },
];
