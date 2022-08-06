import React from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Descriptions, Image, Space, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";

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
import { DEFAULT_RASAN_IMAGE } from "../../../constants";

const { TabPane } = Tabs;

function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();

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
      <CustomPageHeader
        path="/category-list"
        title={category?.name || parseSlug(slug)}
      />

      <div className="relative">
        <Descriptions column={2} layout="vertical">
          <Descriptions.Item
            label={<strong className="font-medium">Category Name</strong>}
            span={2}
          >
            {category?.name}
          </Descriptions.Item>

          <Descriptions.Item
            label={<strong className="font-medium">Actions</strong>}
            span={2}
          >
            <Space>
              <PublishCategory />

              <Button
                onClick={() => navigate(`/product-list/add?category=${slug}`)}
              >
                Add New Products
              </Button>
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <div className="absolute right-0 top-0">
          <Image
            className="bg-white rounded"
            height={140}
            src={
              category?.category_image?.full_size ||
              category?.category_image?.thumbnail ||
              DEFAULT_RASAN_IMAGE
            }
          />
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <ProductsTab slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <SkuTab slug={slug} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Category;
