import { Tabs } from "antd";
import UserList from "./UserList";
import AdminUserList from "./AdminUserList";
import CustomPageHeader from "../../shared/PageHeader";

const Users = () => {
  return (
    <div>
      <CustomPageHeader title="Users List" isBasicHeader />
      <Tabs className="bg-white !p-6 rounded-lg" defaultActiveKey="general">
        <Tabs.TabPane key="general" tab="Customer">
          <UserList />
        </Tabs.TabPane>

        <Tabs.TabPane key="admin" tab="Admin">
          <AdminUserList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Users;
