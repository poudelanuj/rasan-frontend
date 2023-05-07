import { Card, Select, Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getOrderMetrics } from "../../api/orders";
import { getEndUser } from "../../api/users";
import { useAuth } from "../../AuthProvider";
import { GET_ORDER_METRICS } from "../../constants/queryKeys";
import WelcomeCard from "./shared/WelcomeCard";
import { DASHBOARD_TIME_KEYS } from "../../constants";
// import OrdersAssigned from "./shared/OrdersAssigned";
import OrderMetrics from "./OrderMetrics";
import { capitalize } from "lodash";
import CustomPageHeader from "../../shared/PageHeader";
import { GET_ADDRESSES } from "../../constants/queryKeys";
import { getAddresses } from "../../api/userAddresses";
import BrandAnalytics from "../../components/Analytics/BrandAnalytics";
import CategoryAnalytics from "../../components/Analytics/CategoryAnalytics";
import OrderAnalytics from "../../components/Analytics/OrderAnalytics";
import ProductAnalytics from "../../components/Analytics/ProductAnalytics";
import ProductSkuAnalytics from "../../components/Analytics/ProductSkuAnalytics";

const Dashboard = () => {
  const { logout } = useAuth();

  const [orderTimeKey, setOrderTimeKey] = useState(
    DASHBOARD_TIME_KEYS[2].value
  );

  const { data: orderMetrics, status: orderMetricsStatus } = useQuery({
    queryFn: () => getOrderMetrics(orderTimeKey),
    queryKey: [GET_ORDER_METRICS, orderTimeKey],
  });

  const { data: userInfo } = useQuery(["get-end-user"], getEndUser, {
    retry: false,
    onError: (err) => {
      logout();
    },
  });

  const { SubMenu } = Menu;

  const [address, setAddress] = useState({ id: null, name: "" });

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const addressTree = addressList?.map((province) => ({
    title: province.name,
    key: province.name,
    id: province.id,
    children: province.cities?.map((city) => ({
      title: city.name,
      key: city.name,
      id: city.id,
      children: city.areas?.map((area) => ({
        title: area.name,
        key: area.name,
        id: area.id,
      })),
    })),
  }));

  const items = (
    <Menu selectable>
      {addressTree?.map((province) => (
        <SubMenu key={province.name} title={province.title} menu>
          {province.children?.map((city) => (
            <SubMenu key={city.name} title={city.title} menu>
              {city.children?.map((area) => (
                <Menu.Item
                  key={area.name}
                  onClick={() => setAddress({ id: area.id, name: area.title })}
                >
                  {area.title}
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );

  return (
    <>
      <div>
        <CustomPageHeader title="Dashboard" isBasicHeader />

        <div className="flex gap-3 sm:flex-row flex-col">
          <WelcomeCard
            avatar={userInfo?.profile_picture?.thumbnail}
            contact={userInfo?.phone || userInfo?.alternate_phone}
            group={
              JSON.parse(localStorage.getItem("groups") || "[]")?.[0]?.name ||
              "unknown"
            }
            title={`Welcome ${userInfo?.full_name?.split(" ")[0]}`}
          />

          <div className="grow flex flex-col gap-3">
            <Card bodyStyle={{ padding: 10 }} className="grow !rounded-lg">
              <div className="flex mb-2 justify-between items-center">
                <h4 className="m-0">Orders</h4>

                <Select
                  defaultValue={DASHBOARD_TIME_KEYS[2].value}
                  loading={orderMetricsStatus === "loading"}
                  size="small"
                  style={{ width: 120 }}
                  onChange={(value) => setOrderTimeKey(value)}
                >
                  {DASHBOARD_TIME_KEYS.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {capitalize(item.name)}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <OrderMetrics orderMetrics={orderMetrics} />
            </Card>
          </div>
        </div>

        {/* <div className="bg-white p-6 mt-8 rounded-lg">
          <h3 className="text-xl">My Orders</h3>
          <OrdersAssigned />
        </div> */}

        {JSON.parse(localStorage.getItem("groups") || "[]")?.[0]?.name ===
          "superadmin" && (
          <div className="flex flex-col gap-10 py-10">
            {/* <span className="w-full flex items-center justify-between px-5">
            <h2 className="text-xl text-gray-700 mb-0">
              Location Based Analytics
            </h2>
          </span> */}

            <div className="flex flex-col grid-cols-3 sm:grid gap-10">
              <div className="col-span-2 flex flex-col">
                <OrderAnalytics
                  ExtraFilter={() => (
                    <Dropdown overlay={items} placement="bottomLeft">
                      <Button>
                        {address?.name || "Address"}{" "}
                        <DownOutlined className="!text-[rgba(0,0,0,0.3)]" />
                      </Button>
                    </Dropdown>
                  )}
                  address={address?.id}
                  isAdmin
                />
              </div>
              <CategoryAnalytics isAdmin />
            </div>

            <div className="flex flex-col sm:grid grid-cols-3 gap-10">
              <ProductSkuAnalytics />
              <BrandAnalytics />
            </div>

            <ProductAnalytics type="GRAPH" />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
