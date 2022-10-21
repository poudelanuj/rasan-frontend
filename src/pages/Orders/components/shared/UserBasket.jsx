import { nanoid } from "nanoid";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addBasketItem,
  deleteBasketItem,
  getBasketInfo,
} from "../../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";
import { getDropdownProductSkus } from "../../../../api/products/productSku";
import { GET_DROPDOWN_PRODUCT_SKUS } from "../../../../constants/queryKeys";
import { STATUS } from "../../../../constants";
import ButtonWPermission from "../../../../shared/ButtonWPermission";

const UserBasket = ({ user, basket_id, setBasketItemsStatus }) => {
  // *********** FORM ************ //
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

  // *********** FORM ************ //
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
    queryFn: () => getDropdownProductSkus(),
    queryKey: [GET_DROPDOWN_PRODUCT_SKUS],
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
    <div>
      <p className="font-semibold mt-6">
        {user?.full_name || ""} {user?.phone || ""}
      </p>

      <Table
        columns={columns}
        dataSource={dataSource || []}
        loading={isBasketItemsRefetching || basketDataStatus === "loading"}
      />

      <hr className="my-5" />
      <h2 className="font-medium text-base mb-5">Add Item</h2>

      {forms?.map((basketForm, index) => (
        <Form key={basketForm.id} layout="horizontal">
          <Space>
            <Form.Item>
              <span>Product SKU</span>
              <Select
                loading={productsStatus === "loading"}
                placeholder="Select Product SKU"
                style={{ width: 200 }}
                showSearch
                onSelect={(value) => setSelectedSku(value)}
              >
                {productSkus &&
                  productSkus.map((item) => (
                    <Select.Option key={item.slug} value={item.slug}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item tooltip="Select Pack Size">
              <span>Pack Size</span>
              <Select
                className="!w-36"
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

            <Form.Item className="relative" name="quantity">
              <span>Quantity</span>
              <Input
                className="!w-20"
                placeholder="Quantity"
                type="number"
                value={
                  forms.find((item) => item.id === basketForm.id)?.quantity
                }
                onChange={(e) => {
                  setForms((prev) => {
                    const temp = [...prev];
                    const index = prev.findIndex(
                      (item) => item.id === basketForm.id
                    );
                    temp[index]["quantity"] = e.target.value;
                    return temp;
                  });
                }}
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

            <Form.Item>
              <span>Price Per Piece</span>
              <Input
                placeholder="Price"
                type="number"
                value={
                  forms.find((item) => item.id === basketForm.id)?.product_pack
                    ?.price_per_piece
                }
                disabled
              />
            </Form.Item>

            <Form.Item>
              <span>Total Amount</span>
              <Input
                placeholder="Total amount"
                type="number"
                value={getTotalAmount(basketForm.id)}
                disabled
              />
            </Form.Item>

            <Form.Item>
              <span>Loyalty</span>
              <Input
                placeholder="Loyalty points"
                type="number"
                value={
                  parseInt(
                    forms.find((item) => item.id === basketForm.id)
                      ?.product_pack?.loyalty_cashback?.loyalty_points_per_pack,
                    10
                  ) * forms.find((item) => item.id === basketForm.id)?.quantity
                }
                disabled
              />
            </Form.Item>

            <Form.Item>
              <span>Cashback</span>
              <Input
                placeholder="Cashback"
                type="number"
                value={
                  parseInt(
                    forms.find((item) => item.id === basketForm.id)
                      ?.product_pack?.loyalty_cashback
                      ?.cashback_amount_per_pack,
                    10
                  ) * forms.find((item) => item.id === basketForm.id)?.quantity
                }
                disabled
              />
            </Form.Item>

            <Form.Item>
              <div style={{ height: 20 }} />
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
          </Space>
        </Form>
      ))}

      <div className="w-full flex justify-end">
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
