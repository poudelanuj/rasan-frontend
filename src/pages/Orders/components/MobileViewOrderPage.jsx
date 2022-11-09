import { Fragment } from "react";
import { Button, Divider } from "antd";
import { startCase } from "lodash";

const MobileViewOrderPage = ({ orderItems, deleteMutation }) => {
  return (
    <>
      {orderItems &&
        orderItems.map((orderItem, index) => (
          <Fragment key={orderItem.id}>
            <div className="w-full flex flex-col gap-2 mb-2">
              {Object.keys(orderItem).map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between text-sm p-2 rounded-lg odd:bg-gray-100"
                >
                  <span>
                    {startCase(item === "id" ? item.toUpperCase() : item)}
                  </span>
                  <span className="font-semibold">{orderItem[item]}</span>
                </div>
              ))}
            </div>

            <Button
              className="!rounded-lg text-sm px-3"
              danger
              onClick={() => deleteMutation(orderItem.id)}
            >
              <span>Delete</span>
            </Button>

            <Divider
              className={`bg-slate-300 ${
                index + 1 === orderItems?.length && "!hidden"
              }`}
            />
          </Fragment>
        ))}
    </>
  );
};
export default MobileViewOrderPage;
