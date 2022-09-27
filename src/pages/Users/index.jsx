import { Tabs } from "antd";
import UserList from "./UserList";
import AdminUserList from "./AdminUserList";

const Users = () => {
  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">Users List</div>
      <Tabs className="bg-white !px-5 !py-3" defaultActiveKey="general">
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
