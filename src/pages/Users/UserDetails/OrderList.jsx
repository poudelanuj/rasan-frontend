import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import { Tabs } from "antd";
import OrdersList from "../../Orders/OrdersList";
import { OrderContext } from "../../Orders";
import { getUserOrder } from "../../../api/orders";
import { DELIVERY_STATUS } from "../../../constants";
import { GET_USER_ORDERS } from "../../../constants/queryKeys";

const OrderList = ({ user }) => {
  const { TabPane } = Tabs;

  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
  const [orders, setOrders] = useState([]);

  const searchInput = useRef();

  const [sortObj, setSortObj] = useState({
    sortType: {
      created_at: false,
      total_paid_amount: false,
    },
    sort: ["-created_at"],
  });

  const {
    data,
    status,
    isRefetching,
    refetch: refetchOrders,
  } = useQuery({
    queryFn: () =>
      getUserOrder({
        user: user.phone.replace("+977-", ""),
        page,
        orderStatus,
        pageSize,
        sort: sortObj.sort,
        search: searchInput.current,
      }),
    queryKey: [
      GET_USER_ORDERS,
      orderStatus + page.toString() + pageSize.toString(),
    ],
  });

  useEffect(() => {
    setOrders([]);
    if (data) setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus, pageSize]);

  return (
    <OrderContext.Provider
      value={{
        dataSource: orders,
        ordersCount: data?.count,
        page,
        pageSize,
        refetchOrders,
        searchInput,
        setPage,
        setPageSize,
        sortObj,
        setSortObj,
        status: isRefetching ? "loading" : status,
      }}
    >
      <Tabs
        defaultActiveKey="all"
        onTabClick={(tabKey) => {
          setPage(1);
          setOrderStatus(tabKey);
        }}
      >
        <TabPane key={"all"} tab={"All"}>
          <OrdersList />
        </TabPane>
        {DELIVERY_STATUS.map(({ name, id }) => (
          <TabPane key={id} tab={name}>
            <OrdersList />
          </TabPane>
        ))}
      </Tabs>
    </OrderContext.Provider>
  );
};

export default OrderList;
