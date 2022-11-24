import { Tabs } from "antd";

import UserInformation from "./UserInformation";

import LiveUserBasket from "./BasketList";
import OrderList from "./OrderList";
import UserAnalytics from "./Analytics";

const { TabPane } = Tabs;

const UserTab = ({ user }) => {
  return (
    <Tabs className="bg-white !px-6 rounded-b-lg" defaultActiveKey="1">
      <TabPane key="1" tab="User Information">
        <UserInformation user={user} />
      </TabPane>
      <TabPane key="2" tab="Order Details">
        <OrderList user={user} />
      </TabPane>
      <TabPane key="3" tab="User Basket">
        <LiveUserBasket user={user} />
      </TabPane>
      <TabPane key="4" tab="Analytics">
        {user && <UserAnalytics user_id={user.id} />}
      </TabPane>
    </Tabs>
  );
};

export default UserTab;
