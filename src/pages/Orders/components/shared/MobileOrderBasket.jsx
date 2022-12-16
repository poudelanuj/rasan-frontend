import { Button, Form, Input, Select, Space, Drawer } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { PlusOutlined } from "@ant-design/icons";
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
import MobileViewOrderPage from "../MobileViewOrderPage";

const MobileViewOrderForm = ({ user }) => {
  const { basket_id } = user;

  const [selectedProductSku, setSelectedSku] = useState();

  const [forms, setForms] = useState({
    product_pack: null,
    quantity: 1,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: basketData, refetch: refetchBasketItems } = useQuery({
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

  // *********** FORM ************ //
  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus({ isDropdown: true }),
    queryKey: [GET_ALL_PRODUCT_SKUS, { isDropdown: true }],
  });

  // *********** FORM ************ //
  const handleBasketSubmit = useMutation(
    () =>
      addBasketItem({
        product_pack: forms.product_pack?.id,
        number_of_packs: forms.quantity,
        basket: basket_id,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
        setForms({
          product_pack: null,
          quantity: 1,
        });
        setSelectedSku(null);
        setIsDrawerOpen(false);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchBasketItems();
        setTimeout(
          () =>
            document.getElementById("create-order-btn").scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            }),
          500
        );
      },
    }
  );

  // *********** FORM ************ //
  const getTotalAmount = () => {
    return parseFloat(
      forms.product_pack?.price_per_piece *
        forms.product_pack?.number_of_items *
        forms.quantity
    ).toFixed(2);
  };

  return (
    <div className="my-4">
      <p className="font-semibold break-all">
        {user?.full_name || ""} {user?.phone || ""}{" "}
        {user.shop && user.shop?.name ? `(${user.shop?.name})` : ""}
      </p>
      <MobileViewOrderPage
        deleteMutation={(id) => handleItemDelete.mutate(id)}
        orderItems={dataSource}
        isCreate
      />

      <Button
        className="!p-0 !border-none !bg-inherit !text-[#00B0C2]"
        icon={<PlusOutlined className="cursor-pointer w-fit" />}
        onClick={() => setIsDrawerOpen(true)}
      >
        Add new SKU
      </Button>

      <Drawer
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-500"
              disabled={
                !(
                  forms.product_pack &&
                  selectedProductSku &&
                  forms.quantity > 0
                )
              }
              type="primary"
              onClick={() => handleBasketSubmit.mutate()}
            >
              Add
            </Button>
          </Space>
        }
        height={400}
        placement="bottom"
        title="Add Item"
        visible={isDrawerOpen}
        destroyOnClose
        onClose={() => setIsDrawerOpen(false)}
      >
        <Form
          className="w-full flex flex-col gap-2 !mb-2"
          layout={"horizontal"}
        >
          <Form.Item className="w-full !mb-0">
            <Select
              loading={productsStatus === "loading"}
              placeholder="Select Product SKU"
              showSearch
              onSelect={(value) => {
                setSelectedSku(value);
                setForms((prev) => ({
                  ...prev,
                  product_pack: productSkus.find((item) => item.slug === value)
                    ?.product_packs[0],
                }));
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
          <Form.Item className="w-full !mb-0" tooltip="Select Pack Size">
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
                setForms((prev) => ({
                  ...prev,
                  product_pack: productSkus
                    .find((item) => item.slug === selectedProductSku)
                    ?.product_packs?.find((pack) => pack.id === value),
                }));
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

          <Form.Item className="w-full !mb-0" name="quantity">
            <Input
              addonBefore={"Quantity"}
              placeholder="Quantity"
              type="number"
              value={forms.quantity}
              onChange={(e) => {
                setForms((prev) => ({ ...prev, quantity: e.target.value }));
              }}
              onKeyDown={(event) => event.key === "-" && event.preventDefault()}
            />
          </Form.Item>

          <Form.Item className="w-full !mb-0">
            <Input
              addonBefore={"Price Per Piece"}
              className="!bg-inherit !text-black"
              placeholder="Price"
              type="number"
              value={forms.product_pack?.price_per_piece}
              disabled
            />
          </Form.Item>

          <Form.Item className="w-full !mb-0">
            <Input
              addonBefore={"Total Amount"}
              className="!bg-inherit !text-black"
              placeholder="Total amount"
              type="number"
              value={!isNaN(getTotalAmount()) ? getTotalAmount() : 0}
              disabled
            />
          </Form.Item>

          <Form.Item className="w-full !mb-0">
            <Input
              addonBefore={"Loyalty"}
              className="!bg-inherit !text-black"
              placeholder="Loyalty points"
              type="number"
              value={parseInt(
                forms.product_pack?.loyalty_cashback?.loyalty_points_per_pack *
                  forms.quantity,
                10
              )}
              disabled
            />
          </Form.Item>

          <Form.Item className="w-full !mb-0">
            <Input
              addonBefore={"Cashback"}
              className="!bg-inherit !text-black"
              placeholder="Cashback"
              type="number"
              value={
                !isNaN(
                  parseFloat(
                    forms.product_pack?.loyalty_cashback
                      ?.cashback_amount_per_pack * forms.quantity
                  ).toFixed(2)
                )
                  ? parseFloat(
                      forms.product_pack?.loyalty_cashback
                        ?.cashback_amount_per_pack * forms.quantity
                    ).toFixed(2)
                  : 0
              }
              disabled
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MobileViewOrderForm;
