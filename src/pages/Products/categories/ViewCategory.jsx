import React, { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { Breadcrumb, Button, Image, Tabs, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

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

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/category-list">Categories</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{category?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, [category]);

  const getHeaderAvatarProps = useCallback(() => {
    return {
      size: 60,
      src: (
        <Image
          className="bg-white rounded"
          height={60}
          src={
            category?.category_image?.full_size ||
            category?.category_image?.thumbnail ||
            DEFAULT_RASAN_IMAGE
          }
        />
      ),
    };
  }, [category]);

  const getPublishTag = useCallback(() => {
    return category?.is_published ? (
      <Tag color="green">PUBLISHED</Tag>
    ) : (
      <Tag color="red">UNPUBLISHED</Tag>
    );
  }, [category]);

  return (
    <>
      <CustomPageHeader
        avatar={getHeaderAvatarProps()}
        breadcrumb={getHeaderBreadcrumb()}
        extra={[
          <PublishCategory key="1" />,
          <Button
            key="2"
            onClick={() => navigate(`/product-list/add?category=${slug}`)}
          >
            Add New Products
          </Button>,
          <Button key="3" type="primary">
            Edit Category
          </Button>,
        ]}
        path="/category-list"
        subTitle={getPublishTag()}
        title={category?.name || parseSlug(slug)}
      />

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
