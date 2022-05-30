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
    key: "users",
    label: "Users",
    icon: <UserOutlined />,
    // children: [{ label: "Users List", key: "user-list" }],
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
            mode="inline"
            defaultSelectedKeys={["0"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={sidebarItems}
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
