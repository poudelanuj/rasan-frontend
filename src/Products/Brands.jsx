import React from "react";
import TabAll from "./Brands/TabAll";
import TabSKU from "./Brands/TabSKU";
import { useQuery } from "react-query";
import { getBrand } from "../context/CategoryContext";

import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import Loader from "./subComponents/Loader";
const { TabPane } = Tabs;

const onChange = (key) => {};

function Brands() {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useQuery("get-brand", () =>
    getBrand({ slug })
  );

  return (
    <>
      {isLoading && <Loader loadingText={"Loading Brand..."} />}
      {isError && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <div className="text-3xl bg-white p-5">{data.data.data.name}</div>
          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane key="1" tab="Products">
              <TabAll slug={slug} />
            </TabPane>
            <TabPane key="2" tab="SKU">
              <TabSKU slug={slug} />
            </TabPane>
          </Tabs>
        </div>
      )}
    </>
  );
}

export default Brands;
