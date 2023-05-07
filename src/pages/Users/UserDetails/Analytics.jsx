import React, { useState } from "react";
import { useQuery } from "react-query";
import { getAddresses } from "../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import CategoryAnalytics from "../../../components/Analytics/CategoryAnalytics";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";
import BrandAnalytics from "../../../components/Analytics/BrandAnalytics";
import ProductAnalytics from "../../../components/Analytics/ProductAnalytics";
import ProductSkuAnalytics from "../../../components/Analytics/ProductSkuAnalytics";

const UserAnalytics = ({ user_id }) => {
  const { SubMenu } = Menu;

  const [address, setAddress] = useState({ id: null, name: "" });

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const addressTree = addressList?.map((province) => ({
    title: province.name,
    key: province.name,
    id: province.id,
    children: province.cities?.map((city) => ({
      title: city.name,
      key: city.name,
      id: city.id,
      children: city.areas?.map((area) => ({
        title: area.name,
        key: area.name,
        id: area.id,
      })),
    })),
  }));

  const items = (
    <Menu selectable>
      {addressTree?.map((province) => (
        <SubMenu key={province.name} title={province.title} menu>
          {province.children?.map((city) => (
            <SubMenu key={city.name} title={city.title} menu>
              {city.children?.map((area) => (
                <Menu.Item
                  key={area.name}
                  onClick={() => setAddress({ id: area.id, name: area.title })}
                >
                  {area.title}
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );

  return (
    <div className="flex flex-col gap-10 py-10">
      {/* <span className="w-full flex items-center justify-between px-5">
            <h2 className="text-xl text-gray-700 mb-0">
              Location Based Analytics
            </h2>
          </span> */}

      <div className="flex flex-col grid-cols-3 sm:grid gap-10">
        <div className="col-span-2 flex flex-col">
          <OrderAnalytics
            ExtraFilter={() => (
              <Dropdown overlay={items} placement="bottomLeft">
                <Button>
                  {address?.name || "Address"}{" "}
                  <DownOutlined className="!text-[rgba(0,0,0,0.3)]" />
                </Button>
              </Dropdown>
            )}
            address={address?.id}
            user_id={user_id}
            isAdmin
          />
        </div>
        <CategoryAnalytics user_id={user_id} isAdmin />
      </div>

      <div className="flex flex-col sm:grid grid-cols-3 gap-10">
        <ProductSkuAnalytics user_id={user_id} />
        <BrandAnalytics user_id={user_id} />
      </div>

      <ProductAnalytics type="GRAPH" user_id={user_id} />
    </div>
  );
};

export default UserAnalytics;
