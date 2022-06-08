import Icon, {
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context as UserContext } from "../context/UserContext";
import Loyalty from "../svgs/Loyalty";
import Time from "../svgs/Time";
import UserTab from "./UserTab";

const User = () => {
  let { user_id } = useParams();

  const {
    state: { user, isLoading },
    getUser,
  } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      await getUser(user_id);
    })(); //IIFE
  }, []);

  return (
    <div>
      <div className="text-3xl bg-white mb-3 p-5">User Details</div>
      {isLoading && <div>Loading....</div>}
      {user && (
        <div>
          <div className="flex text-text bg-white p-4 justify-between">
            <div className="details flex w-6/12">
              <img
                className="image mr-3"
                src={user.profile_picture.small_square_crop}
                alt={user.full_name}
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
                <div className="text-text text-lg">500</div>
              </div>
            </div>
            <div className="Last-logged-in flex">
              <Icon component={Time} />
              <div className="text-light_text text-sm ml-2">
                Last Logged In
                <div className="text-text text-lg">10:00 AM</div>
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
