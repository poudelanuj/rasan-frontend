import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Select, Table } from "antd";
import { useState } from "react";
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

  const [form, setForm] = useState({
    product_pack: null,
    quantity: 1,
  });

  const {
    data: basketData,
    status: basketDataStatus,
    refetch: refetchBasketItems,
    isRefetching: isBasketItemsRefetching,
  } = useQuery({
    queryFn: () => getBasketInfo(basket_id),
    queryKey: ["getBasketInfo", basket_id],
    enabled: !!basket_id,
  });

  // *********** FORM ************ //
  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus(),
    queryKey: [GET_ALL_PRODUCT_SKUS],
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
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchBasketItems();
      },
    }
  );

  const dataSource = basketData?.items?.map(
    ({ id, number_of_packs, product_pack, product_sku }) => {
      const productPack = product_sku.product_packs.find(
        (item) => item.id === product_pack
      );

      const pricePerPiece = product_sku.product.includes_vat
        ? (productPack?.price_per_piece / 1.13).toFixed(2)
        : productPack?.price_per_piece;

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
      width: "20%",
      render: (text) => {
        return text === "isForm" ? (
          <Select
            loading={productsStatus === "loading"}
            placeholder="Select Product SKU"
            showSearch
            onSelect={(value) => {
              setSelectedProductSku(value);
              setForm({
                ...form,
                product_pack: productSkus.find((item) => item.slug === value)
                  ?.product_packs[0],
              });
            }}
          >
            {productSkus &&
              productSkus.map((item) => (
                <Select.Option key={item.slug} value={item.slug}>
                  {item.name}
                </Select.Option>
              ))}
          </Select>
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "12%",
      render: (text) => {
        return text === "isForm" ? (
          <>
            <Input
              className="w-20"
              placeholder="Quantity"
              type="number"
              value={form?.quantity}
              onChange={(e) => {
                e.key !== "." && setForm({ ...form, quantity: e.target.value });
              }}
              onKeyDown={(event) => event.key === "." && event.preventDefault()}
            />
            <span
              className={`${
                form.quantity < 0 ? "block" : "hidden"
              } absolute text-xs text-red-600`}
            >
              Negative value not allowed
            </span>
          </>
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Pack Size",
      dataIndex: "packSize",
      key: "packSize",
      width: "12%",
      render: (text) => {
        return text === "isForm" ? (
          <Select
            key={selectedProductSku}
            defaultValue={
              productSkus &&
              productSkus.find((item) => item.slug === selectedProductSku)
                ?.product_packs[0].id
            }
            placeholder="Select Pack Size"
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
        ) : (
          <>{text}</>
        );
      },
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      width: "12%",
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
        <>
          Rs.{" "}
          {text === "isForm"
            ? parseInt(
                form?.product_pack?.loyalty_cashback?.cashback_amount_per_pack,
                10
              ) * form?.quantity || 0
            : text}
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "12%",
      render: (text) => (
        <>
          Rs. {text === "isForm" ? form?.product_pack?.price_per_piece : text}
          /pc
        </>
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
        <>
          Rs.{" "}
          {text === "isForm"
            ? form?.product_pack?.price_per_piece *
                form?.product_pack?.number_of_items *
                form?.quantity || 0
            : text}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, { id }) => (
        <div>
          {text === "isForm" ? (
            <PlusOutlined
              className="cursor-pointer"
              onClick={() => handleBasketSubmit.mutate(form)}
            />
          ) : (
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
            loading={isBasketItemsRefetching || basketDataStatus === "loading"}
            pagination={false}
            scroll={{ x: isEmpty(dataSource) && !isMobileView ? null : 1000 }}
          />

          <div className="w-full px-[9.5%] flex flex-col gap-2 items-end mt-2 text-sm">
            <span className="flex gap-10">
              <span>SubTotal</span>
              <span>
                Rs.{" "}
                {parseFloat(
                  dataSource?.reduce((prev, curr) => prev + curr.total, 0)
                ).toFixed(2)}
              </span>
            </span>
            <span className="flex gap-10">
              <span>Tax (13%)</span>
              <span>
                Rs.{" "}
                {parseFloat(
                  dataSource?.reduce((prev, curr) => {
                    if (curr.hasVat) return prev + curr.price;
                    return prev;
                  }, 0)
                ).toFixed(2)}
              </span>
            </span>

            <span className="flex gap-10">
              <span>Total</span>
              <span>
                Rs.{" "}
                {(
                  parseFloat(
                    dataSource?.reduce((prev, curr) => prev + curr.total, 0)
                  ) +
                  parseFloat(
                    dataSource?.reduce((prev, curr) => {
                      if (curr.hasVat) return prev + curr.price;
                      return prev;
                    }, 0)
                  )
                ).toFixed(2)}
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBasket;
