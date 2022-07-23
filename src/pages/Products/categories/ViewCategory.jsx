import React from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Tabs } from "antd";
import { useParams } from "react-router-dom";

import ProductsTab from "./Tabs/ProductsTab";
import SkuTab from "./Tabs/SkuTab";
import CustomPageHeader from "../../../shared/PageHeader";
import { getCategory, publishCategory } from "../../../api/categories";
import { GET_SINGLE_CATEGORY } from "../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";

const { TabPane } = Tabs;

function Category() {
  const { slug } = useParams();
  const {
    data: category,
    status,
    refetch: refetchCategory,
  } = useQuery({
    queryFn: () => getCategory(slug),
    queryKey: [GET_SINGLE_CATEGORY, slug],
  });

  const onPublishCategory = useMutation(
    ({ slug, shouldPublish }) => publishCategory({ slug, shouldPublish }),
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Category Updated"),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchCategory(),
    }
  );

  const PublishCategory = () => {
    return (
      <Button
        disabled={status === "loading"}
        loading={onPublishCategory.status === "loading"}
        type={category?.is_published ? "danger" : "primary"}
        onClick={() =>
          onPublishCategory.mutate({
            slug: category.slug,
            shouldPublish: !category.is_published,
          })
        }
      >
        {category?.is_published ? "Unpublish" : "Publish"}
      </Button>
    );
  };

  return (
    <>
      <div className="mt-4">
        <CustomPageHeader
          path="/category-list"
          title={category?.name || parseSlug(slug)}
        />
      </div>

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <ProductsTab publishCategory={<PublishCategory />} slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <SkuTab publishCategory={<PublishCategory />} slug={slug} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Category;
