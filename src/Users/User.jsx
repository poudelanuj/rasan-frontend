import Icon, {
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getLastLogin, getUser } from "../context/UserContext";
import Loyalty from "../svgs/Loyalty";
import Time from "../svgs/Time";
import UserTab from "./UserTab";

const User = () => {
  let { user_id } = useParams();
  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery(["get-user", user_id], async () => getUser(user_id));
  const phone = user?.phone;
  const { data: lastLoggedInFetch } = useQuery(
    ["get-meta", user_id],
    async () => getLastLogin(phone),
    {
      enabled: !!phone,
    }
  );
  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">User Details</div>
      {isLoading && <div>Loading....</div>}
      {isSuccess && (
        <div>
          <div className="flex text-text bg-white p-4 justify-between">
            <div className="details flex w-6/12">
              <img
                alt={user.full_name}
                className="image mr-3"
                src={user.profile_picture.small_square_crop}
              />
              <div>
                <div className="font-medium text-lg">{user.full_name}</div>
                <div className="flex items-center text-light_text">
                  <div className="flex items-center pr-4">
                    <HomeOutlined className="mr-1" />
                    {user.shop.name}
                  </div>
                  <div className="flex items-center pr-4">
                    <PhoneOutlined className="mr-1" />
                    {user.phone}
                  </div>
                  <div className="flex items-center pr-4">
                    <EnvironmentOutlined className="mr-1" />
                    {user.addresses[0]?.detail_address}
                  </div>
                </div>
              </div>
            </div>

            <div className="loyalty flex">
              <Icon component={Loyalty} />
              <div className="text-light_text text-sm ml-2">
                Loyalty Points
                <div className="text-text text-lg">
                  {user?.extra_info?.loyalty_points}
                </div>
              </div>
            </div>
            <div className="Last-logged-in flex">
              <Icon component={Time} />
              <div className="text-light_text text-sm ml-2">
                Last Logged In
                <div className="text-text text-lg">
                  {isLoading ? "Loading.." : lastLoggedInFetch}
                </div>
              </div>
            </div>
          </div>
          <UserTab user={user} />
        </div>
      )}
    </div>
  );
};

export default User;
