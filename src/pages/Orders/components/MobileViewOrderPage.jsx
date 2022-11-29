import { Fragment, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Button, Divider, Input, message } from "antd";
import { startCase } from "lodash";
import { updateOrderItem } from "../../../api/orders";
import { openSuccessNotification, openErrorNotification } from "../../../utils";

const MobileViewOrderPage = ({
  orderItems,
  deleteMutation,
  refetchOrderItems,
  orderId,
  isCreate,
}) => {
  const [isProductEditableId, setIsProductEditableId] = useState(null);

  const [productPriceEditVal, setProductPriceEditVal] = useState([]);

  useEffect(() => {
    setProductPriceEditVal(
      orderItems?.map(({ id, price, quantity }) => ({
        id,
        price,
        number_of_packs: quantity,
      }))
    );
  }, [orderItems]);

  const handleItemUpdate = useMutation(
    ({ orderId, itemId, data }) => updateOrderItem({ orderId, itemId, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Updated");
        setIsProductEditableId(null);
      },
      onSettled: () => {
        refetchOrderItems();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );
  return (
    <>
      {orderItems &&
        orderItems.map((orderItem, index) => (
          <Fragment key={orderItem.id}>
            <div className="w-full flex flex-col gap-2 mb-2">
              {Object.keys(orderItem).map(
                (item) =>
                  item !== "numberOfItemsPerPack" &&
                  item !== "numberOfPacks" && (
                    <div
                      key={item}
                      className="flex items-center justify-between text-sm p-2 rounded-lg odd:bg-gray-100"
                    >
                      <span>
                        {startCase(
                          item === "id"
                            ? item.toUpperCase()
                            : item === "hasVat"
                            ? "Tax"
                            : item
                        )}
                      </span>

                      {item === "price" && !isCreate ? (
                        <div className="flex items-center">
                          <Input
                            className={`!bg-inherit !text-black text-right !px-0 font-semibold ${
                              isProductEditableId !== orderItem.id
                                ? "!border-none"
                                : "!border-blue-400 !pr-2"
                            }`}
                            disabled={isProductEditableId !== orderItem.id}
                            id={orderItem.id}
                            name="price"
                            value={
                              productPriceEditVal?.find(
                                (product) => product.id === orderItem.id
                              )?.price
                            }
                            onChange={(event) => {
                              const { id, name, value } = event.target;
                              setProductPriceEditVal((prev) =>
                                prev.map((product) => ({
                                  ...product,
                                  [Number(id) === product.id && name]: value,
                                }))
                              );
                            }}
                          />
                        </div>
                      ) : item === "quantity" && !isCreate ? (
                        <div className="flex items-center">
                          <Input
                            className={`!bg-inherit !text-black text-right !px-0 font-semibold ${
                              isProductEditableId !== orderItem.id
                                ? "!border-none"
                                : "!border-blue-400 !pr-2"
                            }`}
                            disabled={isProductEditableId !== orderItem.id}
                            id={orderItem.id}
                            name="number_of_packs"
                            value={
                              productPriceEditVal?.find(
                                (product) => product.id === orderItem.id
                              )?.number_of_packs
                            }
                            onChange={(event) => {
                              const { id, name, value } = event.target;
                              setProductPriceEditVal((prev) =>
                                prev.map((product) => ({
                                  ...product,
                                  [Number(id) === product.id && name]: value,
                                }))
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <span className="font-semibold">
                          {(() => {
                            return item === "total" && !isCreate
                              ? parseFloat(
                                  productPriceEditVal?.find(
                                    (product) => product.id === orderItem.id
                                  )?.price *
                                    orderItem.numberOfItemsPerPack *
                                    productPriceEditVal?.find(
                                      (product) => product.id === orderItem.id
                                    )?.number_of_packs
                                ).toFixed(2)
                              : item === "hasVat" && orderItem["hasVat"]
                              ? "13%"
                              : orderItem[item];
                          })()}
                        </span>
                      )}
                    </div>
                  )
              )}
            </div>
            <Button
              className="!rounded-lg text-sm px-3 mr-3"
              danger
              onClick={() => deleteMutation(orderItem.id)}
            >
              <span>Delete</span>
            </Button>
            {!isCreate &&
              (isProductEditableId === orderItem.id ? (
                <span className="inline-flex items-center gap-3">
                  <Button
                    className="!rounded-lg text-sm px-3"
                    type="primary"
                    onClick={() => {
                      if (
                        productPriceEditVal?.find(
                          (product) => product.id === isProductEditableId
                        )?.number_of_packs < 0
                      )
                        return message.error("Negative values not allowed");
                      handleItemUpdate.mutate({
                        orderId,
                        itemId: isProductEditableId,
                        data: {
                          price_per_piece: productPriceEditVal?.find(
                            (product) => product.id === isProductEditableId
                          )?.price,
                          number_of_packs: productPriceEditVal?.find(
                            (product) => product.id === isProductEditableId
                          )?.number_of_packs,
                        },
                      });
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    className="!rounded-lg text-sm px-3"
                    onClick={() => {
                      setIsProductEditableId(null);
                      setProductPriceEditVal(
                        orderItems?.map(({ id, price, quantity }) => ({
                          id,
                          price,
                          number_of_packs: quantity,
                        }))
                      );
                    }}
                  >
                    Cancel
                  </Button>
                </span>
              ) : (
                <Button
                  className="!rounded-lg text-sm px-3"
                  onClick={() => setIsProductEditableId(orderItem.id)}
                >
                  Edit
                </Button>
              ))}

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
