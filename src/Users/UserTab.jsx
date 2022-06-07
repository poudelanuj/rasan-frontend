import { Tabs } from "antd";
import UserInformation from "./UserInformation";
const { TabPane } = Tabs;

const UserTab = ({ user }) => (
  <Tabs defaultActiveKey="1">
    <TabPane tab="User Information" key="1">
      <UserInformation user={user} />
    </TabPane>
    <TabPane tab="Order Details" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="User Basket" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
);

export default UserTab;
