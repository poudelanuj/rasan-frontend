import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Breadcrumb, Image, Tabs, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProductsTab from "./Tabs/ProductsTab";
import SkuTab from "./Tabs/SkuTab";
import CustomPageHeader from "../../../shared/PageHeader";
import EditCategory from "./EditCategory";
import { getCategory, publishCategory } from "../../../api/categories";
import { GET_SINGLE_CATEGORY } from "../../../constants/queryKeys";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import { CategoryAnalytics } from "./Tabs/CategoryAnalytics";

const { TabPane } = Tabs;

function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isEditCategory, setIsEditcategory] = useState(false);

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
      <ButtonWPermission
        codename="change_category"
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
      </ButtonWPermission>
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
          <ButtonWPermission
            key="2"
            codename="add_product"
            onClick={() => navigate(`/product-list/add?category=${slug}`)}
          >
            Add New Products
          </ButtonWPermission>,
          <ButtonWPermission
            key="3"
            codename="change_category"
            type="primary"
            onClick={() => setIsEditcategory(true)}
          >
            Edit Category
          </ButtonWPermission>,
        ]}
        path="/category-list"
        subTitle={getPublishTag()}
        title={category?.name || parseSlug(slug)}
      />

      <EditCategory
        closeModal={() => setIsEditcategory(false)}
        isOpen={isEditCategory}
        slug={slug}
      />
      <div className="p-6 bg-white rounded-lg">
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <ProductsTab slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <SkuTab slug={slug} />
          </TabPane>
          <TabPane key="3" tab="Analytics">
            <CategoryAnalytics />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Category;
