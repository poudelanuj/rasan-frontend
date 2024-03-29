import defaultRasanImage from "../assets/images/rasan-default.png";

const colors = {
  primary: "#00A0B0",
  light: "#F6FAFF",
  notification_sent: "#9EEAEC",
  notification_clicked: "#A3C1FB",
  notification_seen: "#FFEAAC",
};
const siteInformation = {
  base_url: process.env.REACT_APP_BASE_URL || "http://159.65.145.153:8000/",
};

export const ORDER_INVOICE_URL =
  siteInformation.base_url + "api/order/admin/order/invoice/{ORDER_ID}/";

export { colors, siteInformation };

export const DEFAULT_CARD_IMAGE =
  "https://fisnikde.com/wp-content/uploads/2019/01/broken-image.png";

export const DEFAULT_RASAN_IMAGE = defaultRasanImage;

export const COMING_SOON_IMAGE =
  "https://motoworldnepal.com/wp-content/uploads/2022/06/coming-soon-2579123_960_720.jpg";

export const ALERT_TYPE = {
  publish: "publish",
  unpublish: "unpublish",
  delete: "delete",
};

export const IN_PROCESS = "in_process";
export const CONFIRMED_BY_CSR = "confirmed_by_csr";
export const ON_THE_WAY_TO_DELIVERY = "on_the_way_to_delivery";
export const ON_HOLD = "on_hold";
export const DELIVERED = "delivered";
export const DELIVERY_RETURNED = "delivery_returned";
export const CANCELLED_BY_CSR = "cancelled_by_csr";
export const CANCEL_REQUESTED = "cancel_requested";
export const ARCHIVED = "archived";

export const DELIVERY_STATUS = [
  { name: "In Process", id: IN_PROCESS },
  { name: "Confirmed by CSR", id: CONFIRMED_BY_CSR },
  { name: "On the way to Delivery", id: ON_THE_WAY_TO_DELIVERY },
  { name: "On Hold", id: ON_HOLD },
  { name: "Delivered", id: DELIVERED },
  { name: "Delivery Returned", id: DELIVERY_RETURNED },
  { name: "Cancelled by CSR", id: CANCELLED_BY_CSR },
  { name: "Cancel Requested", id: CANCEL_REQUESTED },
  { name: "Archived", id: "archived" },
];

export const ORDER_STATUS_ENUMS = [
  { index: 0, name: "In Process", id: IN_PROCESS },
  { index: 1, name: "Confirmed by CSR", id: CONFIRMED_BY_CSR },
  { index: 2, name: "On the way to Delivery", id: ON_THE_WAY_TO_DELIVERY },
  { index: 3, name: "Delivered", id: DELIVERED },
];

export const BANK_DEPOSIT = "bank_deposit";
export const REDEEM = "redeem";

export const UNPAID = "unpaid";
export const PAID = "paid";
export const PAYMENT_STATUS = ["unverified", UNPAID, PAID];

export const CASH_ON_DELIVERY = "cash_on_delivery";
export const PAYMENT_METHODS = [
  "cips",
  "esewa",
  "khalti",
  "bank_deposit",
  "redeem",
  CASH_ON_DELIVERY,
];

export const STATUS = {
  idle: "idle",
  processing: "processing",
  success: "success",
};

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
  "welcome",
  "general_info",
  "offer",
  "notice",
  "tutorial",
  "order_placed",
  "order_ready_for_delivery",
  "order_completed",
  "order_cancelled",
  "loyalty_points_earned",
  "cashback_earned",
  "coupons_earned",
  "crm_status_changed",
  "user_profile_verification_requested",
  "user_profile_verified",
  "user_profile_verification_rejected",
  "user_business_intelligence",
  "market_intelligence",
];

export const NOTIFICATION_DESTINATION_TYPES = ["offer", "notice"];

export const DASHBOARD_TIME_KEYS = [
  {
    name: "today",
    value: "today",
  },
  {
    name: "this week",
    value: "this_week",
  },
  {
    name: "this month",
    value: "this_month",
  },
  {
    name: "this year",
    value: "this_year",
  },
];

export const PUBLISHED = "Published";
export const UNPUBLISHED = "Not published";

export const ACTIVE = "Active";
export const INACTIVE = "Inactive";
