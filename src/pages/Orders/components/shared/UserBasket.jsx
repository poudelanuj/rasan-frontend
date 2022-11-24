import { nanoid } from "nanoid";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Table } from "antd";
import { useState, useEffect } from "react";
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
import ButtonWPermission from "../../../../shared/ButtonWPermission";
import { useAuth } from "../../../../AuthProvider";
import MobileViewOrderPage from "../MobileViewOrderPage";

const UserBasket = ({ user, setBasketItemsStatus }) => {
  const { isMobileView } = useAuth();

  const { basket_id } = user;

  const [selectedProductSku, setSelectedSku] = useState();

  const [forms, setForms] = useState([
    {
      id: nanoid(),
      product_pack: null,
      quantity: 1,
    },
  ]);

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
        price: pricePerPiece,
        total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
        loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
        cashback: cashbackPerPack * numberOfPacks,
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
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Pack Size",
      dataIndex: "packSize",
      key: "packSize",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <>Rs. {text}/pc</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <>Rs. {text}</>,
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
    },
    {
      title: "Cashback",
      dataIndex: "cashback",
      key: "cashback",
      render: (text) => <>Rs. {text}</>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div>
          <DeleteOutlined
            className="mx-3"
            onClick={() => handleItemDelete.mutate(id)}
          />
        </div>
      ),
    },
  ];

  // *********** FORM ************ //
  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus(),
    queryKey: [GET_ALL_PRODUCT_SKUS],
  });

  // *********** FORM ************ //
  const handleBasketSubmit = useMutation(
    () =>
      Promise.all(
        forms
          .filter((item) => item.product_pack !== null)
          .map((form) =>
            addBasketItem({
              product_pack: form.product_pack?.id,
              number_of_packs: form.quantity,
              basket: basket_id,
            })
          )
      ),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
        setForms([
          {
            id: nanoid(),
            product_pack: null,
            quantity: 1,
          },
        ]);
        setSelectedSku(null);
        setBasketItemsStatus(STATUS.success);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchBasketItems();
      },
    }
  );

  // *********** FORM ************ //
  const getTotalAmount = (formId) => {
    const basketForm = forms.find((item) => item.id === formId);
    const productPack = basketForm?.product_pack;

    return (
      productPack?.price_per_piece *
      productPack?.number_of_items *
      basketForm?.quantity
    );
  };

  const handleAddForm = () => {
    const newId = nanoid();
    setForms((prev) => [
      ...prev,
      { id: newId, product_pack: null, quantity: 1 },
    ]);
  };

  useEffect(() => {
    if (forms[0]?.product_pack !== null)
      setBasketItemsStatus(STATUS.processing);
    else setBasketItemsStatus(STATUS.idle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

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
        <Table
          columns={columns}
          dataSource={dataSource || []}
          loading={isBasketItemsRefetching || basketDataStatus === "loading"}
          scroll={{ x: isEmpty(dataSource) && !isMobileView ? null : 1000 }}
        />
      )}

      <hr className="my-5" />
      <h2 className="font-medium text-base mb-5">Add Item</h2>

      {forms?.map((basketForm, index) => (
        <Form
          key={basketForm.id}
          className="w-full flex sm:flex-row flex-col !items-start gap-2"
          layout={isMobileView ? "horizontal" : "vertical"}
        >
          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Product SKU"}
          >
            <Select
              className="sm:!w-[200px]"
              loading={productsStatus === "loading"}
              placeholder="Select Product SKU"
              showSearch
              onSelect={(value) => {
                setSelectedSku(value);
                setForms((prev) => {
                  const productPack = productSkus.find(
                    (item) => item.slug === value
                  )?.product_packs[0];

                  const temp = [...prev];
                  const index = prev.findIndex(
                    (item) => item.id === basketForm.id
                  );
                  temp[index]["product_pack"] = productPack;
                  return temp;
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
          </Form.Item>
          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Pack Size"}
            tooltip="Select Pack Size"
          >
            <Select
              key={selectedProductSku}
              className="sm:!w-36"
              defaultValue={
                productSkus &&
                productSkus.find((item) => item.slug === selectedProductSku)
                  ?.product_packs[0].id
              }
              placeholder="Select Pack Size"
              showSearch
              onSelect={(value) => {
                setForms((prev) => {
                  const productPack = productSkus
                    .find((item) => item.slug === selectedProductSku)
                    ?.product_packs?.find((pack) => pack.id === value);

                  const temp = [...prev];
                  const index = prev.findIndex(
                    (item) => item.id === basketForm.id
                  );
                  temp[index]["product_pack"] = productPack;
                  return temp;
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
          </Form.Item>

          <Form.Item
            className="sm:w-auto w-full relative !mb-0"
            label={!isMobileView && "Quantity"}
            name="quantity"
          >
            <Input
              addonBefore={isMobileView && "Quantity"}
              className="sm:!w-20"
              placeholder="Quantity"
              type="number"
              value={forms.find((item) => item.id === basketForm.id)?.quantity}
              onChange={(e) => {
                e.key !== "." &&
                  setForms((prev) => {
                    const temp = [...prev];
                    const index = prev.findIndex(
                      (item) => item.id === basketForm.id
                    );
                    temp[index]["quantity"] = e.target.value;
                    return temp;
                  });
              }}
              onKeyDown={(event) => event.key === "." && event.preventDefault()}
            />
            <span
              className={`${
                forms[forms.findIndex((item) => item.id === basketForm.id)]
                  .quantity < 0
                  ? "block"
                  : "hidden"
              } absolute text-xs text-red-600`}
            >
              Negative value not allowed
            </span>
          </Form.Item>

          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Price Per Piece"}
          >
            <Input
              addonBefore={isMobileView && "Price Per Piece"}
              className="!bg-inherit !text-black"
              placeholder="Price"
              type="number"
              value={
                forms.find((item) => item.id === basketForm.id)?.product_pack
                  ?.price_per_piece
              }
              disabled
            />
          </Form.Item>

          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Total Amount"}
          >
            <Input
              addonBefore={isMobileView && "Total Amount"}
              className="!bg-inherit !text-black"
              placeholder="Total amount"
              type="number"
              value={getTotalAmount(basketForm.id)}
              disabled
            />
          </Form.Item>

          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Loyalty"}
          >
            <Input
              addonBefore={isMobileView && "Loyalty"}
              className="!bg-inherit !text-black"
              placeholder="Loyalty points"
              type="number"
              value={
                parseInt(
                  forms.find((item) => item.id === basketForm.id)?.product_pack
                    ?.loyalty_cashback?.loyalty_points_per_pack,
                  10
                ) * forms.find((item) => item.id === basketForm.id)?.quantity
              }
              disabled
            />
          </Form.Item>

          <Form.Item
            className="sm:w-auto w-full !mb-0"
            label={!isMobileView && "Cashback"}
          >
            <Input
              addonBefore={isMobileView && "Cashback"}
              className="!bg-inherit !text-black"
              placeholder="Cashback"
              type="number"
              value={
                parseInt(
                  forms.find((item) => item.id === basketForm.id)?.product_pack
                    ?.loyalty_cashback?.cashback_amount_per_pack,
                  10
                ) * forms.find((item) => item.id === basketForm.id)?.quantity
              }
              disabled
            />
          </Form.Item>

          <Form.Item>
            <div className="sm:h-[30px]" />
            {index + 1 === forms.length ? (
              <ButtonWPermission
                codename="add_basketitem"
                disabled={forms.some(({ quantity }) => quantity < 0)}
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAddForm}
              />
            ) : (
              <Button
                icon={<MinusOutlined />}
                type="ghost"
                onClick={() =>
                  setForms((prev) => {
                    let temp = [...prev];
                    temp = temp.filter((item) => item.id !== basketForm.id);
                    return temp;
                  })
                }
              />
            )}
          </Form.Item>
        </Form>
      ))}

      <div className="w-full flex sm:justify-end justify-start">
        <Space>
          <Button
            size="middle"
            type="danger"
            onClick={() => {
              setForms([
                {
                  id: nanoid(),
                  product_pack: null,
                  quantity: 1,
                },
              ]);
            }}
          >
            Clear
          </Button>

          <ButtonWPermission
            codename="add_basketitem"
            disabled={
              forms[0]?.product_pack === null ||
              forms.some(({ quantity }) => quantity < 0)
            }
            loading={handleBasketSubmit.status === "loading"}
            size="middle"
            type="primary"
            onClick={() => handleBasketSubmit.mutate()}
          >
            Save Items To Basket
          </ButtonWPermission>
        </Space>
      </div>
    </div>
  );
};

export default UserBasket;
