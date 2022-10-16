import BrandAnalytics from "./BrandAnalytics";
import OrderAnalytics from "./OrderAnalytics";

const UserAnalytics = ({ user }) => {
  return (
    <div className="grid grid-cols-3 gap-x-10">
      <OrderAnalytics user={user} />
      <BrandAnalytics user={user} />
    </div>
  );
};

export default UserAnalytics;
