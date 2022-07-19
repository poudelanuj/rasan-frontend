import React from "react";
import { useQuery } from "react-query";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";

import TabAll from "./CategoryList/TabAll";
import TabSKU from "./CategoryList/TabSKU";
import { getCategory } from "../../context/CategoryContext";
import { openErrorNotification } from "../../utils/openNotification";
import Loader from "./subComponents/Loader";

const { TabPane } = Tabs;

function Category() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery(
    "get-category",
    () => getCategory({ slug }),
    {
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  return (
    <>
      {isLoading && <Loader loadingText={"Loading Category..."} />}
      {data && (
        <div>
          <div className="text-3xl bg-white p-5">{data.data.data.name}</div>
          <Tabs defaultActiveKey="1">
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

export default Category;
