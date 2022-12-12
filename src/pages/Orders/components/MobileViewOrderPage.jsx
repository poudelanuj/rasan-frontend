import { Fragment, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Input, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
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
      <span className="flex justify-between border-b mb-3 border-b-slate-300">
        <p className="mb-2 font-semibold">Product Name</p>
        <p className="mb-2 font-semibold">Actions</p>
      </span>

      {orderItems &&
        orderItems.map((orderItem) => (
          <Fragment key={orderItem.id}>
            <div className="w-full flex justify-between border-b border-b-gray-300 mb-3">
              <div className="flex flex-col gap-3">
                <p className="font-semibold my-0">{orderItem.productName}</p>

                <div className="grid grid-cols-2 gap-x-8">
                  <div
                    className={`flex gap-2 items-center ${!isCreate && "mb-4"}`}
                  >
                    <p className={!isCreate && "my-0"}>Quantity: </p>
                    {!isCreate ? (
                      <Input
                        className={`!bg-inherit !text-black text-left !p-0 font-semibold ${
                          isProductEditableId !== orderItem.id
                            ? "!border-none"
                            : "!border-blue-400"
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
                    ) : (
                      <p className="font-semibold">{orderItem.quantity}</p>
                    )}
                  </div>

                  <div
                    className={`flex gap-2 items-center ${!isCreate && "mb-4"}`}
                  >
                    <p className={!isCreate && "my-0"}>Price: </p>
                    {!isCreate ? (
                      <Input
                        className={`!bg-inherit !text-black text-left !p-0 !w-fit font-semibold ${
                          isProductEditableId !== orderItem.id
                            ? "!border-none"
                            : "!border-blue-400"
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
                    ) : (
                      <p className="font-semibold">Rs.{orderItem.price}</p>
                    )}
                  </div>

                  <span className="flex gap-2">
                    <p>Pack Size: </p>
                    <p className="font-semibold">{orderItem.packSize}</p>
                  </span>

                  <span className="flex gap-2">
                    <p>VAT: </p>
                    <p className="font-semibold">
                      {orderItem.hasVat ? "13%" : ""}
                    </p>
                  </span>

                  <span className="flex gap-2">
                    <p>Cashback: </p>
                    <p className="font-semibold">Rs.{orderItem.cashback}</p>
                  </span>

                  <span className="flex gap-2">
                    <p>Loyalty: </p>
                    <p className="font-semibold">Rs.{orderItem.loyalty}</p>
                  </span>

                  <span className="flex gap-2">
                    <p>Total: </p>
                    <p className="font-semibold">
                      Rs.
                      {!isCreate
                        ? parseFloat(
                            productPriceEditVal?.find(
                              (product) => product.id === orderItem.id
                            )?.price *
                              orderItem.numberOfItemsPerPack *
                              productPriceEditVal?.find(
                                (product) => product.id === orderItem.id
                              )?.number_of_packs
                          ).toFixed(2)
                        : orderItem.total}
                    </p>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-2.5">
                <DeleteOutlined
                  className="cursor-pointer text-xl !text-red-500"
                  onClick={() => deleteMutation(orderItem.id)}
                />

                {!isCreate &&
                  (isProductEditableId === orderItem.id ? (
                    <span className="flex flex-col items-center gap-3">
                      <SaveOutlined
                        className="cursor-pointer text-xl"
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
                      />

                      <CloseCircleOutlined
                        className="cursor-pointer text-xl"
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
                      />
                    </span>
                  ) : (
                    <EditOutlined
                      className="cursor-pointer text-xl"
                      onClick={() => setIsProductEditableId(orderItem.id)}
                    />
                  ))}
              </div>
            </div>
          </Fragment>
        ))}
    </>
  );
};
export default MobileViewOrderPage;
