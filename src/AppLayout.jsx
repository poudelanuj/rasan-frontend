import { useState } from "react";
import { Avatar, Dropdown, Layout, Menu, Drawer } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useAuth } from "./AuthProvider";
import { getEndUser } from "./context/UserContext";
import Logo from "./svgs/Logo";
import { useEffect } from "react";
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      () => (document.body.style.zoom = "100%")
    );
  }, []);

  return (
    <Layout>
      <Header className="header sm:!px-5 !px-4">
        <MenuOutlined
          className="!text-white !text-xl pb-2 sm:!hidden !block !cursor-pointer"
          onClick={() => setIsDrawerOpen(true)}
        />
        <Logo />
        <div className="w-12 rounded-full text-center text-3xl align-middle text-white">
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
        <Sider className="md:block hidden" width={200}>
          <SidebarMenu />
        </Sider>

        <Drawer
          key="menu"
          bodyStyle={{ padding: 0, margin: 0 }}
          contentWrapperStyle={{ width: 250, height: "100%" }}
          placement={"left"}
          title="Menu"
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <SidebarMenu />
        </Drawer>

        <Layout
          className="sm:px-[24px] sm:pb-[24px] sm:pt-0 px-[10px]"
          style={{
            width: "100%",
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
