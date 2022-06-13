import { faker } from "@faker-js/faker";
import moment from "moment";

const generateOrder = () => ({
  orderId: "#" + faker.datatype.number(),
  customer: faker.name.findName(),
  price: "Rs. " + faker.datatype.number(),
  status: faker.helpers.arrayElement(["in progress", "delivered", "cancelled"]),
  paymentMethod: faker.helpers.arrayElement(["esewa", "khalti"]),
  deliveryDate: moment(faker.datatype.datetime().getTime()).format("ll"),
});

export const getOrders = (count = 10) => {
  const ORDERS = [];
  Array.from({ length: count }).forEach(() => {
    ORDERS.push(generateOrder());
  });
  return ORDERS;
};
