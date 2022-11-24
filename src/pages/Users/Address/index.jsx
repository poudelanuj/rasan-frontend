import React from "react";
import { Tabs } from "antd";
import CustomPageHeader from "../../../shared/PageHeader";
import Analytics from "./Analytics";
import AddressPage from "./AddressPage";

const Address = () => {
  return (
    <React.Fragment>
      <CustomPageHeader title="Address" isBasicHeader />

      <Tabs className="bg-white !p-6 rounded-lg" defaultActiveKey="address">
        <Tabs.TabPane key="address" tab="Address">
          <AddressPage />
        </Tabs.TabPane>

        <Tabs.TabPane key="analytics" tab="Analytics">
          <Analytics />
        </Tabs.TabPane>
      </Tabs>
    </React.Fragment>
  );
};

export default Address;
