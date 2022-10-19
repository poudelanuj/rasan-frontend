import { Avatar, Dropdown, Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
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
          <SidebarMenu />
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
