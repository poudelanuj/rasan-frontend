import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Modal,
  message,
  Tooltip,
  Drawer,
} from "antd";
import axios from "../../../axios";
import {
  DeleteOutlined,
  HomeOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { isEmpty } from "lodash";
import {
  addOrderItem,
  deleteOrderItem,
  getOrder,
} from "../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CustomPageHeader from "../../../shared/PageHeader";
import { updateOrderItem, getPaginatedOrders } from "../../../api/orders";
import {
  DEFAULT_CARD_IMAGE,
  DELIVERY_STATUS,
  ORDER_INVOICE_URL,
  PAYMENT_STATUS,
} from "../../../constants";
// import getOrderStatusColor from "../../../shared/tagColor";
import ChangePayment from "./shared/ChangePayment";
import { updateOrderStatus } from "../../../context/OrdersContext";
import { useAuth } from "../../../AuthProvider";
import { getUser } from "../../../context/UserContext";
import rasanDefault from "../../../assets/images/rasan-default.png";
import { GET_ALL_PRODUCT_SKUS } from "../../../constants/queryKeys";
import { getAllProductSkus } from "../../../api/products/productSku";
import MobileViewOrderPage from "./MobileViewOrderPage";
import ViewOrderShipping from "./shared/ViewOrderShipping";
import AssignUser from "./shared/AssignUser";
import { updateOrder } from "../../../api/orders";

const ViewOrderPage = () => {
  const { isMobileView } = useAuth();

  const navigate = useNavigate();

  const { orderId: initialOrderId } = useParams();

  const [orderId, setOrderId] = useState(initialOrderId);

  const [pageDirectionStatus, setPageDirectionStatus] =
    useState("decrementing");

  const quantityRef = useRef(null),
    productSkuRef = useRef(null),
    addNewSkuRef = useRef(null);

  const [isInitialClick, setIsInitialClick] = useState(false);

  const [isProductSkuDropdownOpen, setIsProductSkuDropdownOpen] =
    useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [comment, setComment] = useState("");

  const [maxCount, setMaxCount] = useState(1);

  const [selectedProductSku, setSelectedSku] = useState();

  const [selectedProductPack, setSelectedPack] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [openChangePayment, setOpenChangePayment] = useState(false);

  const [isProductEditableId, setIsProductEditableId] = useState(null);

  const [productPriceEditVal, setProductPriceEditVal] = useState([]);

  const [isVoucherPreviewVisible, setIsVoucherPreviewVisible] = useState(false);

  const [isViewOrderShippingOpen, setIsViewOrderShippingOpen] = useState(false);

  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);

  const {
    data,
    refetch: refetchOrderItems,
    isRefetching,
  } = useQuery({
    queryFn: () => getOrder(orderId),
    queryKey: ["getOrder", orderId],
    enabled: !!orderId,
    retry: false,
    onSuccess: (res) => {
      setComment(res.comment);
    },
    onError: () => {
      if (pageDirectionStatus === "decrementing" && Number(orderId) !== 1) {
        setOrderId((prev) => Number(prev - 1));
      }
      if (
        pageDirectionStatus === "incrementing" &&
        orderId?.toString() !== maxCount?.toString()
      ) {
        setOrderId((prev) => Number(prev + 1));
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPaginatedOrders({
        page: 1,
        orderStatus: "all",
        size: 1,
        sort: ["-created_at"],
        search: "",
      });
      !isEmpty(data) ? setMaxCount(data?.results[0]?.id) : setMaxCount(1);
    };
    fetchData();
  }, [data]);

  const { data: productSkus, status: productsStatus } = useQuery({
    queryFn: () => getAllProductSkus({ isDropdown: true }),
    queryKey: [GET_ALL_PRODUCT_SKUS, { isDropdown: true }],
  });

  const {
    data: user,
    refetch: refetchUser,
    status: userStatus,
  } = useQuery({
    queryFn: () => data && getUser(data && data.user_profile_id),
    queryKey: ["get-user", data && data.user_profile_id],
    enabled: !!data,
  });

  const addComment = useMutation(() => updateOrder(orderId, { comment }));

  const handleAddItem = useMutation(
    () =>
      addOrderItem(orderId, {
        product_pack: selectedProductPack.id,
        number_of_packs: quantity,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
        setSelectedSku(null);
        setSelectedPack(null);
        setIsDrawerOpen(false);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchOrderItems();
        setTimeout(() => {
          !isRefetching && !isMobileView && productSkuRef.current.focus();
          !isRefetching &&
            isMobileView &&
            document.getElementById("add-new-item-btn").scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            });
        }, 500);
      },
    }
  );

  const dataSource = data?.items?.map(
    ({ id, number_of_packs, product_pack }) => {
      const pricePerPiece = product_pack?.price_per_piece;

      const numberOfPacks = number_of_packs;
      const numberOfItemsPerPack = product_pack?.number_of_items;
      const cashbackPerPack =
        product_pack?.loyalty_cashback?.cashback_amount_per_pack;
      const loyaltyPointsPerPack =
        product_pack?.loyalty_cashback?.loyalty_points_per_pack;
      const originalPrice = product_pack.product_sku.price_per_piece;

      return {
        id,
        productName: product_pack?.product_sku?.name,
        quantity: numberOfPacks,
        packSize: numberOfItemsPerPack,
        price: pricePerPiece,
        hasVat: product_pack.product_sku.product.includes_vat,
        total: pricePerPiece * numberOfPacks * numberOfItemsPerPack,
        loyaltyPoints: loyaltyPointsPerPack * numberOfPacks,
        cashback: cashbackPerPack * numberOfPacks,
        numberOfPacks,
        numberOfItemsPerPack,
        originalPrice,
      };
    }
  );

  useEffect(() => {
    let shouldPress = selectedProductPack && !isInitialClick;
    window.addEventListener("keydown", (e) => {
      if (e.code === "Enter" && shouldPress) handleAddItem.mutate();
      setIsInitialClick(false);
    });

    return () => (shouldPress = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductPack, isInitialClick]);

  const total = {
    subTotal: parseFloat(
      dataSource?.reduce((prev, curr) => {
        if (curr.hasVat)
          return (
            prev +
            (curr.numberOfItemsPerPack * curr.numberOfPacks * curr.price) / 1.13
          );

        return (
          prev + curr.numberOfItemsPerPack * curr.numberOfPacks * curr.price
        );
      }, 0)
    ).toFixed(2),

    tax: parseFloat(
      dataSource?.reduce((prev, curr) => {
        if (curr.hasVat)
          return (
            prev +
            ((curr.numberOfItemsPerPack * curr.numberOfPacks * curr.price) /
              1.13) *
              0.13
          );
        return prev + 0;
      }, 0)
    ).toFixed(2),

    getGrandTotal: function () {
      return (parseFloat(this.subTotal) + parseFloat(this.tax)).toFixed(2);
    },
  };

  const getMarginPrice = (id) => {
    const price = dataSource?.find(
      (product) => product.id === id
    )?.originalPrice;

    const cp = data?.items?.find((product) => product.id === id)?.product_pack
      ?.cost_price_per_piece;

    const marginPrice = price - cp;

    return parseFloat(price - marginPrice * 0.05).toFixed(2);
  };

  useEffect(() => {
    setProductPriceEditVal(
      data?.items?.map(({ id, product_pack, number_of_packs }) => ({
        id,
        price: product_pack?.price_per_piece,
        number_of_packs,
      }))
    );
  }, [data]);

  const handleItemDelete = useMutation(
    (itemId) => deleteOrderItem(orderId, itemId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Deleted");
      },
      onSettled: () => {
        refetchOrderItems();
        // refetchOrders();
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS[0]:
        return "red";
      case PAYMENT_STATUS[1]:
        return "orange";
      default:
        return "green";
    }
  };

  const descriptionColumns = [
    {
      title: "Payment Amount",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (text) => <span className="flex gap-0.5">Rs. {text}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={getPaymentStatusColor(status)}>
          {status.replaceAll("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Completed At",
      dataIndex: "completed_at",
      key: "completed_at",
      render: (_, { completed_at }) =>
        completed_at ? <>{moment(completed_at).format("ll hh:mm a")}</> : "-",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (text) => <span className="flex gap-0.5">Rs. {text}</span>,
    },
    {
      title: "Cashback Applied",
      dataIndex: "cashback_applied",
      key: "cashback_applied",
      render: (text) => <span className="flex gap-0.5">Rs. {text}</span>,
    },
    {
      title: "Cashback Earned",
      dataIndex: "cashback_earned",
      key: "cashback_earned",
      render: (text) => <span className="flex gap-0.5">Rs. {text}</span>,
    },
    {
      title: "PID",
      dataIndex: "pid",
      key: "pid",
    },
    {
      title: "REF ID",
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: <span className="px-3">Voucher Image</span>,
      dataIndex: "voucher_image",
      key: "voucher_image",
      render: (_, { voucher_image }) =>
        voucher_image ? (
          <div className="px-3">
            <span
              className="text-blue-500 cursor-pointer hover:underline my-0 py-0 transition-all"
              onClick={() => setIsVoucherPreviewVisible(true)}
            >
              View Preview
            </span>
            <Image
              className="hidden"
              preview={{
                visible: isVoucherPreviewVisible,
                onVisibleChange: (visible) =>
                  setIsVoucherPreviewVisible(visible),
              }}
              src={data.payment.voucher_image || DEFAULT_CARD_IMAGE}
            />
          </div>
        ) : (
          <span className="px-3">-</span>
        ),
    },
  ];

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "45%",
      render: (text) =>
        text === "isForm" ? (
          <div id="dropdown">
            <Select
              ref={productSkuRef}
              bordered={false}
              className="w-full"
              dropdownMatchSelectWidth={false}
              dropdownRender={(menu) => (
                <div className="!w-[40rem]">{menu}</div>
              )}
              dropdownStyle={{ overflowWrap: "anywhere" }}
              getPopupContainer={() => document.body}
              open={isProductSkuDropdownOpen}
              showSearch
              onBlur={() => setIsProductSkuDropdownOpen(false)}
              onFocus={() => setIsProductSkuDropdownOpen(true)}
              onSelect={(value) => {
                setSelectedSku(value);
                setSelectedPack(
                  productSkus &&
                    productSkus.find((item) => item.slug === value)
                      ?.product_packs[0]
                );
                setQuantity(1);
                setIsProductSkuDropdownOpen(false);
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
        ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "9%",
      render: (text, { id }) =>
        text === "isForm" ? (
          <Input
            ref={quantityRef}
            bordered={false}
            className="w-fit !border-0 px-0"
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            onKeyDown={(event) => event.key === "-" && event.preventDefault()}
          />
        ) : (
          <Input
            className={`w-fit !bg-inherit !text-black ${
              isProductEditableId !== id && "!border-none"
            }`}
            disabled={isProductEditableId !== id}
            id={id}
            name="number_of_packs"
            type="number"
            value={
              productPriceEditVal?.find((product) => product.id === id)
                ?.number_of_packs
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
            onKeyDown={(event) => event.key === "-" && event.preventDefault()}
          />
        ),
    },
    {
      title: "Pack Size",
      dataIndex: "packSize",
      key: "packSize",
      width: "9%",
      render: (text) =>
        text === "isForm" ? (
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
              onFocus={() => setIsInitialClick(true)}
              onSelect={(value) => {
                setSelectedPack(
                  productSkus &&
                    productSkus
                      .find((item) => item.slug === selectedProductSku)
                      ?.product_packs?.find((pack) => pack.id === value)
                );
                setIsInitialClick(true);
                addNewSkuRef.current.focus();
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
        ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      width: "13%",
      render: (text) =>
        text === "isForm" ? (
          <span>
            {parseInt(
              selectedProductPack?.loyalty_cashback?.loyalty_points_per_pack *
                quantity,
              10
            ) || 0}
          </span>
        ) : (
          <>{text}</>
        ),
    },
    {
      title: "Cashback",
      dataIndex: "cashback",
      key: "cashback",
      width: "10%",
      render: (text) =>
        text === "isForm" ? (
          <span className="flex gap-0.5">
            <span>Rs.</span>
            {!isNaN(
              parseFloat(
                selectedProductPack?.loyalty_cashback
                  ?.cashback_amount_per_pack * quantity
              ).toFixed(2)
            )
              ? parseFloat(
                  selectedProductPack?.loyalty_cashback
                    ?.cashback_amount_per_pack * quantity
                ).toFixed(2)
              : 0}
          </span>
        ) : (
          <span className="flex gap-0.5">
            <span>Rs.</span> {text}
          </span>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (text, { id }) =>
        text === "isForm" ? (
          <span className="flex gap-0.5">
            Rs. {selectedProductPack?.price_per_piece || 0}
          </span>
        ) : (
          <div className="flex items-center gap-0.5">
            <span>Rs.</span>
            <Input
              className={`!bg-inherit !text-black !w-20 !pl-0 ${
                (JSON.parse(localStorage.getItem("groups") || "[]")?.[0]
                  ?.name !== "superadmin" ||
                  isProductEditableId !== id) &&
                "!border-none"
              }`}
              disabled={
                JSON.parse(localStorage.getItem("groups") || "[]")?.[0]
                  ?.name !== "superadmin" || isProductEditableId !== id
              }
              id={id}
              name="price"
              type="number"
              value={
                productPriceEditVal?.find((product) => product.id === id)?.price
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
              onKeyDown={(event) => event.key === "-" && event.preventDefault()}
            />
            <Tooltip
              className={`${id === isProductEditableId ? "!block" : "!hidden"}`}
              title={`Base Rate: Rs. ${getMarginPrice(id)}`}
            >
              <QuestionCircleOutlined className="pl-1" />
            </Tooltip>
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
      render: (text, { id, numberOfItemsPerPack }) =>
        text === "isForm" ? (
          <span className="flex items-center gap-0.5">
            <span>Rs.</span> {!isNaN(getTotalAmount()) ? getTotalAmount() : 0}
          </span>
        ) : (
          <span className="flex items-center gap-0.5">
            <span> Rs.</span>
            {parseFloat(
              productPriceEditVal?.find((product) => product.id === id)?.price *
                numberOfItemsPerPack *
                productPriceEditVal?.find((product) => product.id === id)
                  ?.number_of_packs
            ).toFixed(2)}
          </span>
        ),
    },
    {
      title: <span className="px-3">Action</span>,
      dataIndex: "action",
      key: "action",
      render: (text, { id }) =>
        text !== "isForm" && (
          <div className="inline-flex items-center gap-3 px-3">
            <Button
              className="!border-none !p-0 !bg-inherit"
              danger
              onClick={() => handleItemDelete.mutate(id)}
            >
              <DeleteOutlined />
            </Button>

            {isProductEditableId === id ? (
              <span className="inline-flex items-center gap-3">
                <Button
                  disabled={(() => {
                    const baseCondition =
                      !parseInt(
                        productPriceEditVal?.find(
                          (product) => product.id === id
                        )?.number_of_packs
                      ) > 0 ||
                      !parseFloat(
                        productPriceEditVal?.find(
                          (product) => product.id === id
                        )?.price
                      ) > 0;

                    if (
                      JSON.parse(localStorage.getItem("groups") || "[]")?.[0]
                        ?.name === "superadmin"
                    )
                      return baseCondition;

                    return (
                      baseCondition ||
                      parseFloat(
                        productPriceEditVal?.find(
                          (product) => product.id === id
                        )?.price
                      ) < getMarginPrice(id)
                    );
                  })()}
                  size="small"
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

                <CloseCircleOutlined
                  className="cursor-pointer"
                  onClick={() => {
                    setIsProductEditableId(null);
                    setProductPriceEditVal(
                      data?.items?.map(
                        ({ id, product_pack, number_of_packs }) => ({
                          id,
                          price: product_pack?.price_per_piece,
                          number_of_packs,
                        })
                      )
                    );
                  }}
                />
              </span>
            ) : (
              <Button
                className="!border-none !p-0 !bg-inherit !m-0"
                onClick={() => setIsProductEditableId(id)}
              >
                <EditOutlined />
              </Button>
            )}
          </div>
        ),
    },
  ];

  const getTotalAmount = () => {
    return (
      selectedProductPack?.price_per_piece *
      selectedProductPack?.number_of_items *
      quantity
    ).toFixed(2);
  };

  const handleUpdateStatus = useMutation(
    (value) => updateOrderStatus({ orderId, status: value }),
    {
      onSuccess: (data) => {
        refetchOrderItems();
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  // * Will Use This Later 👇
  // eslint-disable-next-line no-unused-vars
  const handleInvoiceDownload = () => {
    try {
      axios
        .get(ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId), {
          responseType: "blob",
        })
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (err) {
      openErrorNotification(err);
    }
  };

  const showConfirm = (name, status) => {
    Modal.confirm({
      title: `Change the status to ${name}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleUpdateStatus.mutate(status);
      },
    });
  };

  return (
    <>
      <CustomPageHeader
        extra={
          <Space>
            <Button
              disabled={Number(orderId) === 1}
              onClick={() => {
                setPageDirectionStatus("decrementing");
                setOrderId((prev) => Number(prev) - 1);
              }}
            >
              Previous
            </Button>
            <Button
              disabled={maxCount?.toString() === orderId?.toString()}
              onClick={() => {
                setPageDirectionStatus("incrementing");
                setOrderId((prev) => Number(prev) + 1);
              }}
            >
              Next
            </Button>
          </Space>
        }
        title={`Order #${orderId}`}
      />

      <div className="p-6 rounded-lg bg-[#FFFFFF]">
        {data && (
          <AssignUser
            assignedTo={data.assigned_to}
            closeModal={() => setIsAssignUserOpen(false)}
            isOpen={isAssignUserOpen}
            orderId={orderId}
          />
        )}

        <ChangePayment
          isOpen={openChangePayment}
          orderType={data?.type}
          payment={data?.payment}
          onClose={() => setOpenChangePayment(false)}
        />

        <div className="w-full flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-3">
          {userStatus === "loading" ? (
            <Spin />
          ) : (
            user && (
              <div className="flex flex-row sm:pb-4 pb-2">
                <img
                  alt={user.full_name}
                  className="sm:block hidden sm:mr-3 sm:h-14 sm:w-14 h-20 w-20 object-cover"
                  src={user.profile_picture.thumbnail || rasanDefault}
                />
                <div className="flex flex-col sm:gap-0 gap-1">
                  <div
                    className="font-medium text-lg cursor-pointer hover:underline"
                    onClick={() => navigate("/user/" + user.id)}
                  >
                    {user.full_name || "User"}
                  </div>
                  <div className="flex sm:flex-row flex-col sm:items-center sm:gap-4 gap-1 text-light_text">
                    <div className="flex items-center gap-1">
                      <HomeOutlined />
                      {user.shop.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <PhoneOutlined />
                      {user.phone}
                    </div>
                    <div
                      className="flex items-center gap-1"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      <EnvironmentOutlined />
                      {!data?.shipping_address ? (
                        <Button
                          size="small"
                          onClick={() => setIsViewOrderShippingOpen(true)}
                        >
                          Select Shipping Address
                        </Button>
                      ) : (
                        <>
                          Shipping address:{" "}
                          {`${
                            user.addresses?.find(
                              (add) => add.id === data?.shipping_address
                            )?.detail_address
                          }, 
                            ${
                              user.addresses?.find(
                                (add) => add.id === data?.shipping_address
                              )?.area.name
                            }, ${
                            user.addresses?.find(
                              (add) => add.id === data?.shipping_address
                            )?.city.name
                          }`}
                        </>
                      )}

                      <ViewOrderShipping
                        closeModal={() => setIsViewOrderShippingOpen(false)}
                        isOpen={isViewOrderShippingOpen}
                        refetchOrder={refetchOrderItems}
                        refetchUser={refetchUser}
                        user={user}
                        userId={data?.user_profile_id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-gray-500 font-normal text-sm">
              {moment(data?.created_at).format("lll")}
            </span>

            <Space className="sm:mb-4 mb-2" size="small">
              {data && (
                <>
                  <Select
                    className="sm:w-44 w-full"
                    disabled={handleUpdateStatus.status === "loading"}
                    placeholder="Select Order Status"
                    value={data.status}
                    showSearch
                    onChange={(value) =>
                      showConfirm(
                        DELIVERY_STATUS.find(({ id }) => id === value).name,
                        value
                      )
                    }
                  >
                    {DELIVERY_STATUS.map(({ name, id }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                  {handleUpdateStatus.status === "loading" && (
                    <Spin size="small" />
                  )}
                </>
              )}

              <Button type="danger">
                <a
                  href={ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Invoice
                </a>
              </Button>

              <Button
                className="!bg-[#00A0B0] !border-none"
                type="primary"
                onClick={() => setIsAssignUserOpen(true)}
              >
                Assign User
              </Button>
            </Space>
          </div>
        </div>

        {data && data.payment && (
          <Descriptions
            bordered={isMobileView}
            className="sm:my-6 my-3"
            column={1}
            title={
              <div className="inline-flex gap-2 items-center">
                <span className="font-medium text-base">Order Payment</span>
                <Button
                  className="!bg-[#00A0B0] !border-none"
                  type="primary"
                  onClick={() => setOpenChangePayment((prev) => !prev)}
                >
                  Change Payment
                </Button>
              </div>
            }
          >
            {isMobileView ? (
              <>
                <Descriptions.Item label="Payment Amount" span={1}>
                  {data.payment.payment_amount}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status" span={1}>
                  <Tag color={getPaymentStatusColor(data.payment.status)}>
                    {data.payment.status.replaceAll("_", " ").toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Completed At" span={1}>
                  {data.payment.completed_at
                    ? moment(data.payment.completed_at).format("ll hh:mm a")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount" span={1}>
                  {data.total_amount}
                </Descriptions.Item>
                <Descriptions.Item label="Cashback Applied" span={1}>
                  {data.previous_cashback_applied}
                </Descriptions.Item>
                <Descriptions.Item label="Cashback Earned" span={1}>
                  {data.total_cashback_earned}
                </Descriptions.Item>
                <Descriptions.Item label="PID" span={3}>
                  {data.payment.pid || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="REF ID" span={3}>
                  {data.payment.refId || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Voucher Image" span={2}>
                  {data.payment.voucher_image ? (
                    <div>
                      <span
                        className="text-blue-500 cursor-pointer hover:underline my-0 py-0 transition-all"
                        onClick={() => setIsVoucherPreviewVisible(true)}
                      >
                        View Preview
                      </span>
                      <Image
                        className="hidden"
                        preview={{
                          visible: isVoucherPreviewVisible,
                          onVisibleChange: (visible) =>
                            setIsVoucherPreviewVisible(visible),
                        }}
                        src={data.payment.voucher_image || DEFAULT_CARD_IMAGE}
                        width={150}
                      />
                    </div>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
              </>
            ) : (
              <Descriptions.Item className="!p-0">
                <Table
                  className="w-full description-table"
                  columns={descriptionColumns}
                  dataSource={[
                    {
                      payment_amount: data.payment.payment_amount,
                      status: data.payment.status,
                      completed_at: data.payment.completed_at,
                      total_amount: data.total_amount,
                      cashback_applied: data.previous_cashback_applied,
                      cashback_earned: data.total_cashback_earned,
                      pid: data.payment.pid,
                      refId: data.payment.refId,
                      voucher_image: data.payment.voucher_image,
                    },
                  ]}
                  pagination={false}
                  bordered
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        <h2 className="font-medium text-base mb-5">Ordered Items</h2>

        {isMobileView ? (
          <MobileViewOrderPage
            deleteMutation={(id) => handleItemDelete.mutate(id)}
            getMarginPrice={getMarginPrice}
            orderId={orderId}
            orderItems={dataSource}
            refetchOrderItems={refetchOrderItems}
          />
        ) : (
          <div id="order-table">
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
              getPopupContainer={() => document.getElementById("order-table")}
              pagination={false}
              scroll={{
                x: isEmpty(dataSource) && !isMobileView ? null : 1000,
              }}
              bordered
            />

            <div className="w-full flex justify-between mt-3 text-sm">
              <Button
                ref={addNewSkuRef}
                className="!p-0 !border-none !bg-inherit !text-[#00B0C2]"
                disabled={!selectedProductSku || !(quantity > 0)}
                icon={<PlusOutlined className="cursor-pointer w-fit" />}
                onClick={() => handleAddItem.mutate()}
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
          </div>
        )}

        {isMobileView && (
          <>
            <hr className="sm:block hidden my-5" />
            <Button
              className="!bg-[#00A0B0] !border-none"
              id="add-new-item-btn"
              type="primary"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add New Item
            </Button>

            {(handleAddItem.status === "loading" ||
              productsStatus === "loading") && (
              <Spin className="mb-5 flex justify-center" />
            )}

            {handleAddItem.status !== "loading" &&
              productsStatus === "success" && (
                <Drawer
                  extra={
                    <Space>
                      <Button onClick={() => setIsDrawerOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-500"
                        disabled={
                          !(
                            selectedProductPack &&
                            selectedProductSku &&
                            quantity > 0
                          )
                        }
                        type="primary"
                        onClick={() => handleAddItem.mutate()}
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
                  <Form className="flex flex-col gap-2" layout="horizontal">
                    <Form.Item className="!mb-0">
                      <Select
                        placeholder="Select Product SKU"
                        showSearch
                        onSelect={(value) => {
                          setSelectedSku(value);
                          setSelectedPack(
                            productSkus &&
                              productSkus.find((item) => item.slug === value)
                                ?.product_packs[0]
                          );
                          setQuantity(1);
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
                    <Form.Item className="!mb-0" tooltip="Select Pack Size">
                      <Select
                        key={selectedProductSku}
                        defaultValue={
                          productSkus &&
                          productSkus.find(
                            (item) => item.slug === selectedProductSku
                          )?.product_packs[0]?.id
                        }
                        placeholder="Select Pack Size"
                        showSearch
                        onSelect={(value) =>
                          setSelectedPack(
                            productSkus &&
                              productSkus
                                .find(
                                  (item) => item.slug === selectedProductSku
                                )
                                ?.product_packs?.find(
                                  (pack) => pack.id === value
                                )
                          )
                        }
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

                    <Form.Item className="!mb-0" name="quantity">
                      <Input
                        addonBefore={isMobileView && "Quantity"}
                        defaultValue={1}
                        placeholder="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
                        onKeyDown={(event) =>
                          event.key === "-" && event.preventDefault()
                        }
                      />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Input
                        addonBefore="Price Per Piece"
                        className="!bg-inherit !text-black"
                        placeholder="Price"
                        type="number"
                        value={selectedProductPack?.price_per_piece}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Input
                        addonBefore="Total Amount"
                        className="!bg-inherit !text-black"
                        placeholder="Total amount"
                        type="number"
                        value={!isNaN(getTotalAmount()) ? getTotalAmount() : 0}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Input
                        addonBefore="Loyalty"
                        className="!bg-inherit !text-black"
                        placeholder="Loyalty points"
                        type="number"
                        value={parseInt(
                          selectedProductPack?.loyalty_cashback
                            ?.loyalty_points_per_pack * quantity,
                          10
                        )}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Input
                        addonBefore="Cashback"
                        className="!bg-inherit !text-black"
                        placeholder="Cashback"
                        type="number"
                        value={
                          !isNaN(
                            parseFloat(
                              selectedProductPack?.loyalty_cashback
                                ?.cashback_amount_per_pack * quantity
                            ).toFixed(2)
                          )
                            ? parseFloat(
                                selectedProductPack?.loyalty_cashback
                                  ?.cashback_amount_per_pack * quantity
                              ).toFixed(2)
                            : 0
                        }
                        disabled
                      />
                    </Form.Item>
                  </Form>
                </Drawer>
              )}
          </>
        )}

        <div className="flex sm:flex-row flex-col gap-4 mt-5 sm:items-end">
          <Input.TextArea
            className="!w-72"
            placeholder="Enter a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="!bg-[#00A0B0] !border-none w-fit"
            type="primary"
            onClick={addComment.mutate}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewOrderPage;
