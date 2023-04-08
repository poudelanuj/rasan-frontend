import { Tabs } from "antd";
import { uniqBy } from "lodash";
import React, { useEffect, useState, useRef } from "react";
import { createContext } from "react";
import { useQuery } from "react-query";
import { getAddresses } from "../../api/userAddresses";
import { getPaginatedOrders } from "../../api/orders";
import { useAuth } from "../../AuthProvider";
import { DELIVERY_STATUS } from "../../constants";
import { GET_PAGINATED_ORDERS, GET_ADDRESSES } from "../../constants/queryKeys";
import CustomPageHeader from "../../shared/PageHeader";
import MobileViewOrderList from "./MobileViewOrderList";
import OrdersList from "./OrdersList";

export const OrderContext = createContext(null);

const Orders = () => {
  const { TabPane } = Tabs;

  const { isMobileView } = useAuth();

  const searchInput = useRef();

  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
  const [orders, setOrders] = useState([]);

  const [selectedArea, setSelectedArea] = useState({
    province: null,
    city: null,
    area: [],
    isAreaChanged: false,
  });

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
      getPaginatedOrders({
        page,
        orderStatus,
        size: pageSize,
        sort: sortObj.sort,
        search: searchInput.current,
        province: selectedArea.province,
        city: selectedArea.city,
        area: selectedArea.area,
      }),
    queryKey: [
      GET_PAGINATED_ORDERS,
      orderStatus + page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
  });

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  useEffect(() => {
    setOrders([]);
    if (data) setOrders((prev) => uniqBy([...prev, ...data.results], "id"));
  }, [data]);

  useEffect(() => {
    refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus, sortObj, pageSize, selectedArea]);

  return (
    <div>
      <CustomPageHeader title="Orders" isBasicHeader />

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
          addressList,
          selectedArea,
          setSelectedArea,
        }}
      >
        <Tabs
          className="bg-white sm:!py-2 sm:!px-6 !p-4 rounded-lg"
          defaultActiveKey="all"
          tabBarGutter={21}
          onTabClick={(tabKey) => {
            setPage(1);
            setOrderStatus(tabKey);
          }}
        >
          <TabPane key={"all"} tab={"All"}>
            {isMobileView ? <MobileViewOrderList /> : <OrdersList />}
          </TabPane>

          {DELIVERY_STATUS.map(({ name, id }) => (
            <TabPane key={id} tab={name}>
              {isMobileView ? <MobileViewOrderList /> : <OrdersList />}
            </TabPane>
          ))}
        </Tabs>
      </OrderContext.Provider>
    </div>
  );
};

export default Orders;
