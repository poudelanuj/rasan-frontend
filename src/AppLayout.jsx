import {
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { getEndUser } from "./context/UserContext";
import Logo from "./svgs/Logo";
const { Header, Content, Sider } = Layout;
const headerItem = (logout) => (
  <Menu
    items={[
      {
        key: "1",
        label: "Log Out",
      },
    ]}
    onClick={({ key }) => {
      if (key === "1") logout();
    }}
  />
);
const sidebarItems = [
  // {
  //   key: "/",
  //   label: "Dashboard",
  //   icon: <AppstoreOutlined />,
  // },
  {
    key: "orders",
    label: "Orders",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "products",
    label: "Products",
    icon: <ShoppingOutlined />,
    children: [
      { label: "Categories", key: "category-list" },
      { label: "Brands", key: "brands" },
      { label: "Products", key: "product-list" },
      { label: "Product SKUs", key: "product-sku" },
      { label: "Rasan Choices", key: "product-groups" },
    ],
  },
  {
    key: "users-section",
    label: "Users",
    icon: <UserOutlined />,
    children: [
      { label: "Users List", key: "users" },
      { label: "OTP Requests", key: "otp-requests" },
    ],
  },
  {
    key: "user-groups",
    label: "User Groups",
    icon: <UsergroupAddOutlined />,
  },
  {
    key: "live-user-basket",
    label: "Live User Basket",
    icon: <ShopOutlined />,
  },
  {
    key: "crm",
    label: "CRM",
    icon: <CustomerServiceOutlined />,
    children: [
      { label: "Support Ticket", key: "crm" },
      { label: "Return Request", key: "crm/return-request" },
      { label: "Out of Stock Enquiry", key: "crm/stock-enquiry" },
      { label: "User Feedbacks", key: "crm/user-feedbacks" },
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <BellOutlined />,
  },
];
const AppLayout = () => {
  let navigate = useNavigate();
  let { logout } = useAuth();
  const { data: userInfo, isSuccess } = useQuery(
    ["get-end-user"],
    async () => getEndUser(),
    {
      retry: false,
      onError: (err) => {
        logout();
      },
    }
  );
  return (
    <Layout>
      <Header className="header">
        <Logo />
        <div className="w-12 h-12 rounded-full text-center text-3xl align-middle text-white">
          <Dropdown overlay={() => headerItem(logout)} arrow>
            <div className="cursor-pointer" onClick={(e) => e.preventDefault()}>
              {isSuccess && (
                <>
                  {userInfo?.profile_picture?.thumbnail ? (
                    <img
                      alt={userInfo?.full_name?.[0]}
                      className="rounded-full w-12 h-12"
                      src={userInfo?.profile_picture?.thumbnail}
                    />
                  ) : (
                    <UserOutlined />
                  )}
                </>
              )}
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            defaultOpenKeys={["sub1"]}
            defaultSelectedKeys={["0"]}
            items={sidebarItems}
            mode="inline"
            style={{
              height: "100%",
              borderRight: 0,
            }}
            onClick={({ key }) => {
              navigate(key);
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            style={{
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
