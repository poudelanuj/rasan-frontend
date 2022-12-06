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
  Steps,
  Modal,
  message,
  Tooltip,
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
import { BsCheckCircleFill } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useEffect } from "react";
import { uniqBy, isEmpty } from "lodash";
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
import { useState } from "react";
import { getAdminUsers } from "../../../api/users";
import {
  updateOrder,
  updateOrderItem,
  getPaginatedOrders,
} from "../../../api/orders";
import {
  DEFAULT_CARD_IMAGE,
  DELIVERY_STATUS,
  ORDER_INVOICE_URL,
  ORDER_STATUS_ENUMS,
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

const ViewOrderPage = () => {
  const { userGroupIds, isMobileView } = useAuth();

  const { orderId: initialOrderId } = useParams();

  const { Option } = Select;

  const [orderId, setOrderId] = useState(initialOrderId);

  const [pageDirectionStatus, setPageDirectionStatus] =
    useState("decrementing");

  const [maxCount, setMaxCount] = useState(1);

  const [selectedProductSku, setSelectedSku] = useState();

  const [selectedProductPack, setSelectedPack] = useState();

  const [quantity, setQuantity] = useState(1);

  const [openChangePayment, setOpenChangePayment] = useState(false);

  const [isProductEditableId, setIsProductEditableId] = useState(null);

  const [productPriceEditVal, setProductPriceEditVal] = useState([]);

  const [isVoucherPreviewVisible, setIsVoucherPreviewVisible] = useState(false);

  const [isViewOrderShippingOpen, setIsViewOrderShippingOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [userList, setUserList] = useState([]);

  let timeout = 0;

  const {
    data,
    status,
    refetch: refetchOrderItems,
    isRefetching,
  } = useQuery({
    queryFn: () => getOrder(orderId),
    queryKey: ["getOrder", orderId],
    enabled: !!orderId,
    retry: false,
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
    queryFn: () => getAllProductSkus(),
    queryKey: [GET_ALL_PRODUCT_SKUS],
  });

  const {
    data: user,
    refetch: refetchUser,
    status: userStatus,
  } = useQuery({
    queryFn: () => data && getUser(data && data.user_profile_id),
    queryKey: ["get-user", data && data.user],
    enabled: !!data,
  });

  const {
    data: dataUser,
    status: usersStatus,
    refetch: refetchUserList,
  } = useQuery({
    queryFn: () => userGroupIds && getAdminUsers(userGroupIds, page, 100, ""),
    queryKey: ["getUserList", userGroupIds, page.toString()],
    enabled: !!userGroupIds,
  });

  useEffect(() => {
    if (dataUser) {
      setUserList((prev) => uniqBy([...prev, ...dataUser.results], "id"));
    }
  }, [dataUser]);

  useEffect(() => {
    refetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAddItem = useMutation(
    () =>
      addOrderItem(orderId, {
        product_pack: selectedProductPack.id,
        number_of_packs: quantity,
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Item Added");
      },
      onError: (error) => {
        openErrorNotification(error);
      },
      onSettled: () => {
        refetchOrderItems();
        // refetchOrders();
        setSelectedPack(null);
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
      };
    }
  );

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
        return 0;
      }, 0)
    ).toFixed(2),

    getGrandTotal: function () {
      return (parseFloat(this.subTotal) + parseFloat(this.tax)).toFixed(2);
    },
  };

  const getMarginPrice = (id) => {
    const price = dataSource?.find((product) => product.id === id)?.price;

    const mrp = data?.items?.find((product) => product.id === id)?.product_pack
      ?.mrp_per_piece;

    const cashback = dataSource?.find((product) => product.id === id)?.cashback;

    const marginPrice = mrp - price + cashback;

    return parseFloat(price - marginPrice * 0.2).toFixed(2);
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

  const onAssignedToUpdate = useMutation(
    (formValues) =>
      updateOrder(orderId, { assigned_to: formValues["assigned_to"] }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Order Updated");
      },
      onSettled: () => {
        // refetchOrders();
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

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "40%",
      render: (text) =>
        text === "isForm" ? (
          <Select
            className="w-full"
            dropdownMatchSelectWidth={false}
            dropdownRender={(menu) => <div className="!w-[40rem]">{menu}</div>}
            dropdownStyle={{ overflowWrap: "anywhere" }}
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
          <>
            <Input
              className="w-fit"
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
            <span
              className={`${
                quantity < 0 ? "block" : "hidden"
              } absolute text-xs text-red-600`}
            >
              Negative value not allowed
            </span>
          </>
        ) : (
          <Input
            className={`w-fit !bg-inherit !text-black ${
              isProductEditableId !== id && "!border-none"
            }`}
            disabled={isProductEditableId !== id}
            id={id}
            name="number_of_packs"
            value={
              productPriceEditVal?.find((product) => product.id === id)
                ?.number_of_packs
            }
            onChange={(event) => {
              const { id, name, value } = event.target;
              if (value < 0) message.error("Negative values not allowed");
              setProductPriceEditVal((prev) =>
                prev.map((product) => ({
                  ...product,
                  [Number(id) === product.id && name]: value,
                }))
              );
            }}
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
          <Select
            key={selectedProductSku}
            className="w-20"
            defaultValue={
              productSkus &&
              productSkus.find((item) => item.slug === selectedProductSku)
                ?.product_packs[0]?.id
            }
            placeholder="Select Pack Size"
            showSearch
            onSelect={(value) =>
              setSelectedPack(
                productSkus &&
                  productSkus
                    .find((item) => item.slug === selectedProductSku)
                    ?.product_packs?.find((pack) => pack.id === value)
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
        ) : (
          <>{text}</>
        ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      width: "12%",
      render: (text) =>
        text === "isForm" ? (
          <span>
            {parseInt(
              selectedProductPack?.loyalty_cashback?.loyalty_points_per_pack,
              10
            ) * quantity || 0}
          </span>
        ) : (
          <>{text}</>
        ),
    },
    {
      title: "Cashback",
      dataIndex: "cashback",
      key: "cashback",
      width: "12%",
      render: (text) =>
        text === "isForm" ? (
          <span>
            Rs.{" "}
            {parseInt(
              selectedProductPack?.loyalty_cashback?.cashback_amount_per_pack,
              10
            ) * quantity || 0}
          </span>
        ) : (
          <>Rs. {text}</>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "12%",
      render: (text, { id }) =>
        text === "isForm" ? (
          <span>Rs. {selectedProductPack?.price_per_piece || 0}</span>
        ) : (
          <div className="flex items-center">
            <span>Rs.</span>
            <Input
              className={`!bg-inherit !text-black !w-24 ${
                isProductEditableId !== id && "!border-none"
              }`}
              disabled={isProductEditableId !== id}
              id={id}
              name="price"
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
            />
            <Tooltip
              className={`${id === isProductEditableId ? "!block" : "!hidden"}`}
              title={`Please do not enter the price below Rs.${getMarginPrice(
                id
              )}`}
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
          <span>Rs. {getTotalAmount() || 0}</span>
        ) : (
          <>
            Rs.{" "}
            {productPriceEditVal?.find((product) => product.id === id)?.price *
              numberOfItemsPerPack *
              productPriceEditVal?.find((product) => product.id === id)
                ?.number_of_packs}
          </>
        ),
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "12%",
      render: (text, { id }) =>
        text === "isForm" ? (
          <PlusOutlined
            className="cursor-pointer"
            onClick={() => handleAddItem.mutate()}
          />
        ) : (
          <div className="inline-flex items-center gap-3">
            <DeleteOutlined
              className="cursor-pointer"
              onClick={() => handleItemDelete.mutate(id)}
            />

            {isProductEditableId === id ? (
              <span className="inline-flex items-center gap-3">
                <Button
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
              <EditOutlined
                className="cursor-pointer"
                onClick={() => setIsProductEditableId(id)}
              />
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
    );
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
        <ChangePayment
          isOpen={openChangePayment}
          orderType={data?.type}
          payment={data?.payment}
          onClose={() => setOpenChangePayment(false)}
        />

        {data && !isMobileView && (
          <Steps
            className={`site-navigation-steps !mb-4 bg-[#F0F2F5] rounded-lg ${
              isMobileView && "!p-4"
            }`}
            current={
              ORDER_STATUS_ENUMS.find(({ id }) => data.status === id)?.index ||
              ORDER_STATUS_ENUMS.length
            }
            type={isMobileView ? "inline" : "navigation"}
            onChange={(val) => {
              const status = ORDER_STATUS_ENUMS.find(
                (_, index) => val === index
              );

              showConfirm(status.name, status.id);
            }}
          >
            {ORDER_STATUS_ENUMS.map(({ name, id }, index) => (
              <Steps.Step
                key={id}
                icon={
                  ORDER_STATUS_ENUMS.find((status) => status.id === data.status)
                    ?.index > index && (
                    <BsCheckCircleFill
                      className="text-3xl"
                      style={{ color: "#52C41A" }}
                    />
                  )
                }
                status={
                  data.status === id
                    ? "process"
                    : ORDER_STATUS_ENUMS.find(
                        (status) => status.id === data.status
                      )?.index > index
                    ? "finish"
                    : "wait"
                }
                title={
                  <span
                    className={`${
                      ORDER_STATUS_ENUMS.find(
                        (status) => status.id === data.status
                      )?.index > index && "text-[#52C41A]"
                    }`}
                  >
                    {name}
                  </span>
                }
              />
            ))}
            {isEmpty(
              ORDER_STATUS_ENUMS.find((status) => status.id === data.status)
            ) && (
              <Steps.Step
                status={"error"}
                title={
                  DELIVERY_STATUS.find(({ id }) => id === data.status)?.name
                }
              />
            )}
          </Steps>
        )}

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
                <div className="font-medium text-lg">
                  {user.full_name || "User"}
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-0 gap-1 text-light_text">
                  <div className="flex items-center pr-4">
                    <HomeOutlined className="mr-1" />
                    {user.shop.name}
                  </div>
                  <div className="flex items-center pr-4">
                    <PhoneOutlined className="mr-1" />
                    {user.phone}
                  </div>
                  <div className="flex items-center pr-4">
                    <EnvironmentOutlined className="mr-1" />
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
                        {
                          user.addresses?.find(
                            (add) => add.id === data?.shipping_address
                          )?.detail_address
                        }
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

        <div className="flex sm:flex-row flex-col !items-start justify-between w-full">
          <Space className="sm:mb-4 mb-2" size="middle">
            {/* <Tag color={getOrderStatusColor(data?.status)}>
              {data?.status?.replaceAll("_", " ")?.toUpperCase()}
            </Tag> */}

            <Button type="danger">
              <a
                href={ORDER_INVOICE_URL.replace("{ORDER_ID}", orderId)}
                rel="noreferrer"
                target="_blank"
              >
                Invoice
              </a>
            </Button>

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
          </Space>

          <Form
            className="sm:!w-auto !w-full"
            onFinish={(values) => onAssignedToUpdate.mutate(values)}
          >
            {data && (
              <div className="flex sm:flex-row gap-2 flex-col">
                <Form.Item
                  className="!mb-0"
                  initialValue={data?.assigned_to}
                  label="Assign To"
                  name="assigned_to"
                >
                  <Select
                    className="sm:!w-[300px] w-full"
                    defaultValue={data?.assigned_to}
                    filterOption={false}
                    loading={usersStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Users"
                    showSearch
                    onPopupScroll={() =>
                      data?.next && setPage((prev) => prev + 1)
                    }
                    onSearch={(val) => {
                      if (timeout) clearTimeout(timeout);
                      timeout = setTimeout(async () => {
                        setPage(1);
                        const res = await getAdminUsers(
                          userGroupIds,
                          page,
                          100,
                          val
                        );
                        setUserList([]);
                        setUserList(res.results);
                      }, 200);
                    }}
                  >
                    {userList &&
                      userList.map((user) => (
                        <Option key={user.id} value={user.phone}>
                          {user.full_name
                            ? `${user.full_name} (${user.phone})`
                            : user.phone}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item className="!mb-0">
                  <Button
                    htmlType="submit"
                    loading={onAssignedToUpdate.status === "loading"}
                    type="primary"
                  >
                    SAVE
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form>
        </div>

        {data && data.payment && (
          <Descriptions
            className={"sm:mt-6 mt-2"}
            column={isMobileView ? 1 : 3}
            title={
              <Space className="w-full flex sm:flex-row flex-col-reverse sm:!items-center !items-start justify-between">
                <div className="inline-flex gap-2 items-center">
                  <span className="font-medium text-base">Order Payment</span>
                  <Button
                    type="primary"
                    onClick={() => setOpenChangePayment((prev) => !prev)}
                  >
                    Change Payment
                  </Button>
                </div>
                <span className="text-gray-500 font-normal text-sm">
                  {moment(data?.created_at).format("ll")}
                </span>
              </Space>
            }
            bordered
          >
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
          </Descriptions>
        )}
        <br />
        <br />

        <h2 className="font-medium text-base mb-5">Order Items</h2>
        {!isRefetching &&
          status === "success" &&
          (isMobileView ? (
            <MobileViewOrderPage
              deleteMutation={(id) => handleItemDelete.mutate(id)}
              orderId={orderId}
              orderItems={dataSource}
              refetchOrderItems={refetchOrderItems}
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
                scroll={{
                  x: isEmpty(dataSource) && !isMobileView ? null : 1000,
                }}
              />

              <div className="w-full px-[8.2%] flex flex-col gap-2 items-end mt-2 text-sm">
                <span className=" flex gap-10">
                  <span>SubTotal</span>
                  <span>Rs. {total.subTotal}</span>
                </span>
                <span className="flex gap-10">
                  <span>Tax (13%)</span>
                  <span>Rs. {total.tax}</span>
                </span>

                <span className="flex gap-10">
                  <span>Total</span>
                  <span>Rs. {total.getGrandTotal()}</span>
                </span>
              </div>
            </>
          ))}

        {isMobileView && (
          <>
            <hr className="my-5" />
            <h2 className="font-medium text-base mb-5">Add Item</h2>

            {(handleAddItem.status === "loading" ||
              productsStatus === "loading") && (
              <Spin className="mb-5 flex justify-center" />
            )}

            {handleAddItem.status !== "loading" &&
              productsStatus === "success" && (
                <Form
                  className="w-full flex sm:flex-row flex-col !items-start gap-2"
                  layout={isMobileView ? "horizontal" : "vertical"}
                >
                  <Form.Item
                    className="sm:w-auto w-full !mb-0"
                    label={!isMobileView && "Product SKU"}
                  >
                    <Select
                      className="sm:!w-[200px]"
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
                  <Form.Item
                    className="sm:w-auto w-full !mb-0 !flex"
                    label={!isMobileView && "Pack Size"}
                    tooltip="Select Pack Size"
                  >
                    <Select
                      key={selectedProductSku}
                      className="sm:!w-36"
                      defaultValue={
                        productSkus &&
                        productSkus.find(
                          (item) => item.slug === selectedProductSku
                        )?.product_packs[0].id
                      }
                      placeholder="Select Pack Size"
                      showSearch
                      onSelect={(value) =>
                        setSelectedPack(
                          productSkus &&
                            productSkus
                              .find((item) => item.slug === selectedProductSku)
                              ?.product_packs?.find((pack) => pack.id === value)
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

                  <Form.Item
                    className="sm:w-auto w-full relative !mb-0"
                    label={!isMobileView && "Quantity"}
                    name="quantity"
                  >
                    <Input
                      addonBefore={isMobileView && "Quantity"}
                      className="sm:!w-20 "
                      placeholder="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                    <span
                      className={`${
                        quantity < 0 ? "block" : "hidden"
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
                      value={selectedProductPack?.price_per_piece}
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
                      value={getTotalAmount()}
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
                          selectedProductPack?.loyalty_cashback
                            ?.loyalty_points_per_pack,
                          10
                        ) * quantity
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
                          selectedProductPack?.loyalty_cashback
                            ?.cashback_amount_per_pack,
                          10
                        ) * quantity
                      }
                      disabled
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      className="bg-blue-500 sm:!mt-[30px]"
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
                      Add Item
                    </Button>
                  </Form.Item>
                </Form>
              )}
          </>
        )}
      </div>
    </>
  );
};

export default ViewOrderPage;
