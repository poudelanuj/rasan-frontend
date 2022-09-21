import { Avatar, Dropdown, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  AppstoreOutlined,
  FolderOutlined,
  TaobaoCircleOutlined,
  RocketOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
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

const AppLayout = () => {
  const navigate = useNavigate();

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

  const getMenuItem = (key, label, icon, children) => {
    return {
      key,
      label,
      icon,
      children,
    };
  };

  const menuItem = [
    getMenuItem("/", "Dashboard", <AppstoreOutlined />),
    getMenuItem("orders", "Orders", <ShoppingCartOutlined />),
    getMenuItem("products", "Products", <ShoppingOutlined />, [
      getMenuItem("category-list", "Categories"),
      getMenuItem("brands", "Brands"),
      getMenuItem("product-list", "Products"),
      getMenuItem("product-sku", "Product SKUs"),
      getMenuItem("product-groups", "Rasan Choices"),
    ]),
    getMenuItem("users-section", "Users", <UserOutlined />, [
      getMenuItem("users", "Users List"),
      getMenuItem("otp-requests", "OTP Requests"),
    ]),
    getMenuItem("user-groups", "User Groups", <UsergroupAddOutlined />),
    getMenuItem("live-user-basket", "Live User Basket", <ShopOutlined />),
    getMenuItem("crm", "CRM", <CustomerServiceOutlined />, [
      getMenuItem("crm", "Support Ticket"),
      getMenuItem("crm/return-request", "Return Request"),
      getMenuItem("crm/stock-enquiry", "Out of Stock Enquiry"),
      getMenuItem("crm/user-feedbacks", "User Feedbacks"),
    ]),
    getMenuItem("loyalty-redeem", "Loyalty Redeem", <RocketOutlined />),
    getMenuItem("notifications", "Notifications", <BellOutlined />),
    getMenuItem("cms", "CMS", <FolderOutlined />, [
      getMenuItem("cms", "About Us"),
      getMenuItem("cms/tutorial", "Tutorial"),
    ]),
    getMenuItem("promotions", "Promotions", <TaobaoCircleOutlined />),
    getMenuItem("lucky-draw", "Lucky Draw", <AccountBookOutlined />),
  ];

  return (
    <Layout>
      <Header className="header">
        <Logo />
        <div className="w-12 h-12 rounded-full text-center text-3xl align-middle text-white">
          <Dropdown overlay={() => headerItem(logout)} arrow>
            <div className="cursor-pointer">
              {isSuccess &&
                (userInfo?.profile_picture?.thumbnail ? (
                  <Avatar
                    size={44}
                    src={userInfo?.profile_picture?.thumbnail}
                  />
                ) : (
                  <UserOutlined />
                ))}
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            defaultOpenKeys={["sub1"]}
            defaultSelectedKeys={["0"]}
            items={menuItem}
            mode="inline"
            style={{
              height: "100%",
              borderRight: 0,
            }}
            onClick={({ key }) => navigate(key)}
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
