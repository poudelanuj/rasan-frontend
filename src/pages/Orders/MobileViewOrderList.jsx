import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Pagination, Tag, Button, Dropdown, Radio, Space } from "antd";
import { RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { capitalize } from "lodash";
import { OrderContext } from ".";
import getOrderStatusColor from "../../shared/tagColor";

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
  } = useContext(OrderContext);

  const navigate = useNavigate();

  const [isSortAscending, setIsSortAscending] = useState(false);

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
      <Dropdown overlay={menu}>
        <Button className="!rounded-lg text-sm px-3 mb-2">
          <span>Sort</span>
        </Button>
      </Dropdown>

      {dataSource.map((order) => (
        <div
          key={order.id}
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
            <span>Patment Method</span>
            <span className="font-semibold">
              {capitalize(order.payment?.payment_method?.replaceAll("_", " "))}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm p-2 pb-0 rounded-lg">
            <span>Shop Name</span>
            <span className="font-semibold">{order.shop_name}</span>
          </div>

          <Divider className="bg-slate-300" />
        </div>
      ))}

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
