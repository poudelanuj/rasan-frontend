import {
  AppstoreOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "./svgs/Logo";
const { Header, Content, Sider } = Layout;

const sidebarItems = [
  {
    key: "/",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    key: "orders",
    label: "Orders",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "products",
    label: "Products",
    icon: <ShoppingOutlined />,
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
  },
];
const AppLayout = () => {
  let navigate = useNavigate();

  return (
    <Layout>
      <Header className="header">
        <Logo />
        <div className="w-12 h-12 rounded-full border-2 text-center text-3xl align-middle text-white">
          S
        </div>
        {/* <div className="logo" /> */}
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
            // className="site-layout-background"
            style={{
              // padding: 24,
              // backgroundColor: "white",
              // margin: 0,
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
