import { Tabs } from "antd";

import UserInformation from "./UserInformation";
// import LiveUserBasket from "./BasketList";
import OrderList from "./OrderList";
import UserAnalytics from "./Analytics";
import UserAddress from "./Address";
import MostBoughtBrand from "./MostBoughtBrand";
import MostBoughtProductSku from "./MostBoughtProductSku";

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

      {/* <TabPane key="3" tab="User Basket">
        <LiveUserBasket user={user} />
      </TabPane> */}

      <TabPane key="5" tab="Address">
        <UserAddress user={user} />
      </TabPane>

      <TabPane key="4" tab="Analytics">
        {user && <UserAnalytics user_id={user.id} />}
      </TabPane>

      <TabPane key="6" tab="Most Bought brand">
        <MostBoughtBrand brands={user?.order_detail?.most_bought_brand} />
      </TabPane>

      <TabPane key="7" tab="Most Bought Product Sku">
        <MostBoughtProductSku
          products={user?.order_detail?.most_bought_product_sku}
        />
      </TabPane>
    </Tabs>
  );
};

export default UserTab;
