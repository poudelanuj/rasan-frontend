import { Tabs } from "antd";
import UserInformation from "./UserInformation";
const { TabPane } = Tabs;

const UserTab = ({ user }) => (
  <Tabs defaultActiveKey="1">
    <TabPane key="1" tab="User Information">
      <UserInformation user={user} />
    </TabPane>
    <TabPane key="2" tab="Order Details">
      Content of Tab Pane 2
    </TabPane>
    <TabPane key="3" tab="User Basket">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
);

export default UserTab;
