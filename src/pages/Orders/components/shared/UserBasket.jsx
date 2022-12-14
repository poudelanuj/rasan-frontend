import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table } from "antd";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { isEmpty } from "lodash";
import {
  addBasketItem,
  deleteBasketItem,
  getBasketInfo,
} from "../../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { getAllProductSkus } from "../../../../api/products/productSku";
import { GET_ALL_PRODUCT_SKUS } from "../../../../constants/queryKeys";
import { STATUS } from "../../../../constants";
import { useAuth } from "../../../../AuthProvider";
import MobileViewOrderPage from "../MobileViewOrderPage";

const UserBasket = ({ user, setBasketItemsStatus }) => {
  const { isMobileView } = useAuth();

  const { basket_id } = user;

  const [selectedProductSku, setSelectedProductSku] = useState();

  const quantityRef = useRef(null);

  const [isInitialClick, setIsInitialClick] = useState(false);

  const [form, setForm] = useState({
    product_pack: null,
    quantity: 1,
  });

  const { data: basketData, refetch: refetchBasketItems } = useQuery({
    queryFn: () => getBasketInfo(basket_id),
    queryKey: ["getBasketInfo", basket_id],
    enabled: !!basket_id,
  });

  // *********** FORM ************ //
  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus({ isDropdown: true }),
    queryKey: [GET_ALL_PRODUCT_SKUS, { isDropdown: true }],
  });

  // *********** FORM ************ //
  const handleBasketSubmit = useMutation(
    ({ product_pack, quantity }) =>
      addBasketItem({
        product_pack: product_pack?.id,
        number_of_packs: quantity,
        basket: basket_id,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
        setSelectedProductSku(null);
        setBasketItemsStatus(STATUS.success);
        setForm({
          product_pack: null,
          quantity: 1,
        });
        window.removeEventListener("keydown", (e) => {
          if (e.code === "Enter")
            form.product_pack && handleBasketSubmit.mutate(form);
        });
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchBasketItems();
      },
    }
  );

  useEffect(() => {
    let shouldPress = form.product_pack && !isInitialClick;
    window.addEventListener("keydown", (e) => {
      if (e.code === "Enter" && shouldPress) handleBasketSubmit.mutate(form);
      setIsInitialClick(false);
    });

    return () => (shouldPress = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isInitialClick]);

  const dataSource = basketData?.items?.map(
    ({ id, number_of_packs, product_pack, product_sku }) => {
      const productPack = product_sku.product_packs.find(
        (item) => item.id === product_pack
      );

      const pricePerPiece = productPack?.price_per_piece;

      const numberOfPacks = number_of_packs;
      const numberOfItemsPerPack = productPack?.number_of_items;
      const cashbackPerPack =
        productPack?.loyalty_cashback?.cashback_amount_per_pack;
      const loyaltyPointsPerPack =
        productPack?.loyalty_cashback?.loyalty_points_per_pack;

      return {
        id,
        productName: product_sku?.name,
        quantity: numberOfPacks,
        packSize: numberOfItemsPerPack,
        loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
        cashback: cashbackPerPack * numberOfPacks,
        price: pricePerPiece,
        hasVat: product_sku.product.includes_vat,
        total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
      };
    }
  );

  const total = {
    subTotal: parseFloat(
      dataSource?.reduce((prev, curr) => {
        if (curr.hasVat)
          return prev + (curr.packSize * curr.quantity * curr.price) / 1.13;

        return prev + curr.packSize * curr.quantity * curr.price;
      }, 0)
    ).toFixed(2),

    tax: parseFloat(
      dataSource?.reduce((prev, curr) => {
        if (curr.hasVat)
          return (
            prev + ((curr.packSize * curr.quantity * curr.price) / 1.13) * 0.13
          );
        return prev + 0;
      }, 0)
    ).toFixed(2),

    getGrandTotal: function () {
      return (parseFloat(this.subTotal) + parseFloat(this.tax)).toFixed(2);
    },
  };

  const handleItemDelete = useMutation((itemId) => deleteBasketItem(itemId), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Item Deleted");
    },
    onSettled: () => {
      refetchBasketItems();
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "40%",
      render: (text) => {
        return text === "isForm" ? (
          <div id="dropdown">
            <Select
              bordered={false}
              className="w-full !border-0"
              dropdownMatchSelectWidth={false}
              dropdownRender={(menu) => (
                <div className="!w-[40rem]">{menu}</div>
              )}
              dropdownStyle={{ overflowWrap: "anywhere" }}
              getPopupContainer={() => document.body}
              loading={productsStatus === "loading"}
              showSearch
              onSelect={(value) => {
                setSelectedProductSku(value);
                setForm({
                  ...form,
                  product_pack: productSkus.find((item) => item.slug === value)
                    ?.product_packs[0],
                });
                setIsInitialClick(true);
                quantityRef.current.focus();
              }}
            >
              {productSkus &&
                productSkus.map((item) => (
                  <Select.Option key={item.slug} value={item.slug}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </div>
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "9%",
      render: (text) => {
        return text === "isForm" ? (
          <Input
            ref={quantityRef}
            bordered={false}
            className="w-fit !border-0 !px-0"
            type="number"
            value={form?.quantity}
            onChange={(e) => {
              e.key !== "." && setForm({ ...form, quantity: e.target.value });
            }}
            onKeyDown={(event) =>
              (event.key === "." || event.key === "-") && event.preventDefault()
            }
          />
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Pack Size",
      dataIndex: "packSize",
      key: "packSize",
      width: "9%",
      render: (text) => {
        return text === "isForm" ? (
          <div id="dropdown">
            <Select
              key={selectedProductSku}
              bordered={false}
              className="w-20"
              defaultValue={
                productSkus &&
                productSkus.find((item) => item.slug === selectedProductSku)
                  ?.product_packs[0]?.id
              }
              getPopupContainer={() => document.body}
              showSearch
              onSelect={(value) => {
                setForm({
                  ...form,
                  product_pack: productSkus
                    .find((item) => item.slug === selectedProductSku)
                    ?.product_packs?.find((pack) => pack.id === value),
                });
              }}
            >
              {productSkus &&
                productSkus
                  .find((item) => item.slug === selectedProductSku)
                  ?.product_packs?.map((pack) => (
                    <Select.Option key={pack.id} value={pack.id}>
                      {pack.number_of_items}
                    </Select.Option>
                  ))}
            </Select>
          </div>
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      width: "14%",
      render: (text) => {
        return text === "isForm" ? (
          <span>
            {parseInt(
              form?.product_pack?.loyalty_cashback?.loyalty_points_per_pack,
              10
            ) * form?.quantity || 0}
          </span>
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Cashback",
      dataIndex: "cashback",
      key: "cashback",
      width: "12%",
      render: (text) => (
        <div className="flex gap-0.5">
          <span> Rs.</span>
          <span>
            {text === "isForm"
              ? parseInt(
                  form?.product_pack?.loyalty_cashback
                    ?.cashback_amount_per_pack,
                  10
                ) * form?.quantity || 0
              : text}
          </span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (text) => (
        <div className="flex gap-0.5">
          Rs.
          <span>
            {text === "isForm" ? form?.product_pack?.price_per_piece : text}
          </span>
        </div>
      ),
    },
    {
      title: "Tax",
      dataIndex: "hasVat",
      key: "hasVat",
      width: "7%",
      render: (_, { hasVat }) => <>{hasVat ? "13%" : ""}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "12%",
      render: (text) => (
        <div className="flex gap-0.5">
          Rs.
          <span>
            {text === "isForm"
              ? form?.product_pack?.price_per_piece *
                  form?.product_pack?.number_of_items *
                  form?.quantity || 0
              : text}
          </span>
        </div>
      ),
    },
    {
      title: <span className="px-3">Action</span>,
      dataIndex: "action",
      key: "action",
      render: (text, { id }) => (
        <div className="px-3">
          {text !== "isForm" && (
            <DeleteOutlined onClick={() => handleItemDelete.mutate(id)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="my-4">
      <p className="font-semibold">
        {user?.full_name || ""} {user?.phone || ""}
      </p>

      {isMobileView ? (
        <MobileViewOrderPage
          deleteMutation={(id) => handleItemDelete.mutate(id)}
          orderItems={dataSource}
        />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={
              (dataSource && [
                ...dataSource,
                {
                  productName: "isForm",
                  quantity: "isForm",
                  packSize: "isForm",
                  price: "isForm",
                  total: "isForm",
                  loyaltyPoints: "isForm",
                  cashback: "isForm",
                  action: "isForm",
                },
              ]) ||
              []
            }
            pagination={false}
            scroll={{ x: isEmpty(dataSource) && !isMobileView ? null : 1000 }}
            bordered
          />

          <div className="w-full flex justify-between mt-3 text-sm">
            <Button
              className="!p-0 !border-none !bg-inherit !text-[#00B0C2]"
              disabled={
                !selectedProductSku ||
                !form.product_pack ||
                !(form.quantity > 0)
              }
              icon={<PlusOutlined className="cursor-pointer w-fit" />}
              onClick={() => handleBasketSubmit.mutate(form)}
            >
              Add new SKU
            </Button>

            <div className="flex flex-col gap-2 items-end">
              <span className="flex gap-10">
                <span>SubTotal</span>
                <span>Rs. {total.subTotal}</span>
              </span>
              <span className="flex gap-10">
                <span>Tax (13%)</span>
                <span>Rs. {total.tax}</span>
              </span>

              <span className="flex gap-10">
                <span>Total</span>
                <span className="font-semibold">
                  Rs. {total.getGrandTotal()}
                </span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBasket;
