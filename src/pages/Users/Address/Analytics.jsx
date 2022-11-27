import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import { getAddresses } from "../../../api/userAddresses";
import BrandAnalytics from "../../../components/Analytics/BrandAnalytics";
import CategoryAnalytics from "../../../components/Analytics/CategoryAnalytics";
import OrderAnalytics from "../../../components/Analytics/OrderAnalytics";
import ProductAnalytics from "../../../components/Analytics/ProductAnalytics";
import ProductSkuAnalytics from "../../../components/Analytics/ProductSkuAnalytics";

const Analytics = () => {
  const { SubMenu } = Menu;

  const [address, setAddress] = useState("");

  const { data: addressList, refetch: refetchAddress } = useQuery({
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
                  onClick={() => setAddress(area.title)}
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
    <div className="flex flex-col gap-2">
      <span className="w-full flex items-center justify-between px-5">
        <h2 className="text-xl text-gray-700 mb-0">Location Based Analytics</h2>

        <Dropdown overlay={items} placement="bottomLeft">
          <Button>
            {address || "Address"}{" "}
            <DownOutlined className="!text-[rgba(0,0,0,0.3)]" />
          </Button>
        </Dropdown>
      </span>

      <div className="grid grid-cols-3 gap-x-10">
        <OrderAnalytics address={address} />
        <CategoryAnalytics address={address} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductSkuAnalytics address={address} />
        <BrandAnalytics address={address} />
      </div>

      <div className="grid grid-cols-3 gap-x-10">
        <ProductAnalytics />
      </div>
    </div>
  );
};

export default Analytics;
