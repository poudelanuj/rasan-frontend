import { faker } from "@faker-js/faker";

const generateOrder = () => ({
  orderId: faker.datatype.number(),
  customer: faker.name.findName(),
  price: faker.datatype.number(),
  status: faker.helpers.arrayElement(["in process", "delivered", "cancelled"]),
  paymentMethod: faker.helpers.arrayElement(["esewa", "khalti"]),
  deliveryDate: faker.datatype.datetime().getTime(),
});

export const getOrders = (count = 10) => {
  const ORDERS = [];
  Array.from({ length: count }).forEach(() => {
    ORDERS.push(generateOrder());
  });
  return ORDERS;
};
