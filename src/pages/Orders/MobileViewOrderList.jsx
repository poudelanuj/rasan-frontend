import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import {
  Divider,
  Pagination,
  Tag,
  Button,
  Dropdown,
  Radio,
  Space,
  Spin,
} from "antd";
import {
  RightOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { capitalize } from "lodash";
import { OrderContext } from ".";
import getOrderStatusColor from "../../shared/tagColor";
import ButtonWPermission from "../../shared/ButtonWPermission";
import { openSuccessNotification, openErrorNotification } from "../../utils";
import { updateOrderStatus } from "../../context/OrdersContext";
import DeleteOrder from "./components/DeleteOrder";

const MobileViewOrderList = () => {
  const {
    dataSource,
    refetchOrders,
    page,
    setPage,
    pageSize,
    setPageSize,
    ordersCount,
    sortObj,
    setSortObj,
    status,
    searchInput,
  } = useContext(OrderContext);

  const navigate = useNavigate();

  const [isSortAscending, setIsSortAscending] = useState(false);

  const [isArchiveOrder, setIsArchiveOrder] = useState({
    isOpen: false,
    id: null,
  });

  let timeout = 0;

  const handleArchiveOrder = useMutation(
    (id) =>
      updateOrderStatus({
        orderId: id,
        status: "archived",
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchOrders();
        setIsArchiveOrder({ isOpen: false, id: null });
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const menu = (
    <span className="flex flex-col gap-2.5 bg-white shadow-lg z-10 rounded-lg p-3">
      <Radio.Group
        value={sortObj.sort[0].replace("-", "")}
        onChange={({ target: { value } }) => {
          setSortObj((prev) => ({
            ...prev,
            sort: [`${isSortAscending ? "" : "-"}${value}`],
          }));
        }}
      >
        <Space direction="vertical">
          <Radio value="created_at">ID / Ordered At</Radio>
          <Radio value="total_paid_amount">Total Paid Amount</Radio>
        </Space>
      </Radio.Group>

      <Divider className="!my-0 bg-slate-300" />

      <Radio.Group
        value={isSortAscending ? "ascending" : "descending"}
        onChange={({ target: { value } }) => {
          setIsSortAscending(value === "ascending");
          setSortObj((prev) => ({
            ...prev,
            sort: [
              `${value === "ascending" ? "" : "-"}${prev.sort[0].replace(
                "-",
                ""
              )}`,
            ],
          }));
          refetchOrders();
        }}
      >
        <Space direction="vertical">
          <Radio value="ascending">Ascending</Radio>
          <Radio value="descending">Descending</Radio>
        </Space>
      </Radio.Group>
    </span>
  );

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Button className="!rounded-lg text-sm px-3 w-24">
          <span>Export</span>
        </Button>

        <ButtonWPermission
          className="!rounded-lg text-sm px-3 w-full"
          codename="add_order"
          type="primary"
          onClick={() => {
            navigate("/orders/create-order");
          }}
        >
          <span>Create New Order</span>
        </ButtonWPermission>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Dropdown overlay={menu}>
          <Button className="!rounded-lg text-sm px-3 w-24">
            <span>Sort</span>
          </Button>
        </Dropdown>

        <div className="py-[3px] px-3 w-full border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
          <SearchOutlined style={{ color: "#D9D9D9" }} />
          <input
            className="focus:outline-none w-full ml-1 placeholder:text-[#D9D9D9]"
            placeholder="Search user, contact, shop"
            type="text"
            onChange={(e) => {
              searchInput.current = e.target.value;
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(() => {
                setPage(1);
                refetchOrders();
              }, 400);
            }}
          />
        </div>

        {(status === "loading" || status === "refetching") && (
          <Spin indicator={<LoadingOutlined />} />
        )}
      </div>

      {dataSource.map((order) => (
        <React.Fragment key={order.id}>
          <div
            className="w-full flex flex-col gap-2"
            onClick={() => navigate(`/orders/view-order/${order.id}`)}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="font-bold">Order Id: {order.id}</span>

                <span className="text-xs">
                  {moment(order.created_at).format("lll")}
                </span>
              </div>

              <div className="flex items-center">
                <Tag color={getOrderStatusColor(order.status)}>
                  {order.status.toUpperCase().replaceAll("_", " ")}
                </Tag>

                <RightOutlined />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-100">
              <span>Customer</span>
              <span className="font-semibold">
                {order.customer_name
                  ? `${order.customer_name} (${order.phone})`
                  : order.phone}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm p-2 rounded-lg">
              <span>Total Paid Amount</span>
              <span className="font-semibold">{order.total_paid_amount}</span>
            </div>

            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-100">
              <span>Payment Method</span>
              <span className="font-semibold">
                {capitalize(
                  order.payment?.payment_method?.replaceAll("_", " ")
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm p-2 pb-4 rounded-lg">
              <span>Shop Name</span>
              <span className="font-semibold">{order.shop_name}</span>
            </div>
          </div>

          <ButtonWPermission
            className="!rounded-lg text-sm px-3"
            codename="delete_order"
            danger
            onClick={() => setIsArchiveOrder({ isOpen: true, id: order.id })}
          >
            <span>Archive</span>
          </ButtonWPermission>

          <Divider className="bg-slate-300" />
        </React.Fragment>
      ))}

      <DeleteOrder
        closeModal={() => setIsArchiveOrder({ isOpen: false, id: null })}
        deleteMutation={() => handleArchiveOrder.mutate(isArchiveOrder.id)}
        isOpen={isArchiveOrder.isOpen}
        status={handleArchiveOrder.status}
        title={"Order #" + isArchiveOrder.id}
      />

      <Pagination
        current={page}
        pageSize={pageSize}
        total={ordersCount}
        showSizeChanger
        onChange={(page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        }}
      />
    </>
  );
};

export default MobileViewOrderList;
