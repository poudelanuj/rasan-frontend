import { useAuth } from "./AuthProvider";
import { Menu } from "antd";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BellOutlined,
  AppstoreOutlined,
  FolderOutlined,
  TaobaoCircleOutlined,
  RocketOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";

const getSidebarItems = ({ key, label, icon, children }) => ({
  key,
  label,
  icon,
  children,
});

const sidebarItem = [
  {
    key: "/",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    key: "orders",
    label: "Orders",
    codename: "view_order",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "products",
    label: "Products",

    icon: <ShoppingOutlined />,
    children: [
      { label: "Categories", key: "category-list", codename: "view_category" },
      {
        label: "Brands",
        key: "brands",
        codename: "view_brand",
      },
      {
        label: "Products",
        key: "product-list",
        codename: "view_product",
      },
      {
        label: "Product Pack",
        key: "product-pack",
        codename: "view_product",
      },
      { label: "Product SKU", key: "product-sku", codename: "view_productsku" },
      {
        label: "Rasan Choices",
        key: "product-groups",
        codename: "view_productgroup",
      },
    ],
  },
  {
    key: "users-section",
    label: "Users",
    icon: <UserOutlined />,
    children: [
      { label: "Users List", key: "users", codename: "view_user" },
      { label: "OTP Requests", key: "otp-requests", codename: "view_otp" },
    ],
  },
  {
    key: "user-groups",
    label: "User Groups",
    icon: <UsergroupAddOutlined />,
    codename: "view_group",
  },
  {
    key: "live-user-basket",
    label: "Live User Basket",
    icon: <ShopOutlined />,
    codename: "view_basket",
  },
  {
    key: "crm",
    label: "CRM",
    icon: <CustomerServiceOutlined />,
    children: [
      { label: "Support Ticket", key: "crm", codename: "view_ticket" },
      {
        label: "Return Request",
        key: "crm/return-request",
        codename: "view_ticket",
      },
      {
        label: "Out of Stock Enquiry",
        key: "crm/stock-enquiry",
        codename: "view_ticket",
      },
      {
        label: "User Feedbacks",
        key: "crm/user-feedbacks",
        codename: "view_feedback",
      },
    ],
  },
  {
    key: "loyalty-redeem",
    label: "Loyalty Redeem",
    codename: "view_loyalty",
    icon: <RocketOutlined />,
  },
  {
    key: "notifications",
    label: "Notifications",
    codename: "view_notificationgroup",
    icon: <BellOutlined />,
  },
  {
    key: "cms",
    label: "CMS",
    icon: <FolderOutlined />,
    children: [
      { label: "About Us", key: "cms", codename: "view_faqgroup" },
      { label: "Tutorial", key: "cms/tutorial", codename: "view_tutorial" },
    ],
  },
  {
    key: "promotions",
    label: "Promotions",
    codename: "view_promotion",
    icon: <TaobaoCircleOutlined />,
  },
  {
    key: "lucky-draw",
    label: "Lucky Draw",
    codename: "view_luckydrawevent",
    icon: <AccountBookOutlined />,
  },
];

const SidebarMenu = () => {
  const { permissions } = useAuth();

  const navigate = useNavigate();

  const sidebarItems = sidebarItem.map(
    ({ key, label, icon, children, codename }) => {
      const singleParent =
        !isEmpty(
          permissions &&
            permissions.filter(
              ({ codename: codeName }) => codename === codeName
            )
        ) || key === "/";

      const childrenItems =
        !singleParent &&
        children?.filter(
          ({ codename }) =>
            permissions &&
            permissions.find(({ codename: codeName }) => codename === codeName)
        );

      return singleParent
        ? getSidebarItems({
            key,
            label,
            icon,
          })
        : !isEmpty(childrenItems) &&
            getSidebarItems({
              key,
              label,
              icon,
              children: childrenItems,
            });
    }
  );

  return (
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
  );
};

export default SidebarMenu;
