import React from "react";
import TabAll from "./Tabs/TabAll";
import TabSKU from "./Tabs/TabSKU";
import { useMutation, useQuery } from "react-query";

import { Button, Descriptions, Image, Space, Tabs, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import { getBrand, publishBrand } from "../../../api/brands";
import { GET_SINGLE_BRAND } from "../../../constants/queryKeys";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
const { TabPane } = Tabs;

function Brands() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: brand,
    status,
    refetch: refetchBrand,
  } = useQuery({
    queryFn: () => getBrand(slug),
    queryKey: [GET_SINGLE_BRAND, slug],
  });

  const onPublishBrand = useMutation(
    ({ slug, shouldPublish }) => publishBrand({ slug, shouldPublish }),
    {
      onSuccess: (data) =>
        openSuccessNotification(data.message || "Category Updated"),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchBrand(),
    }
  );

  const PublishBrand = () => {
    return (
      <Button
        disabled={status === "loading"}
        loading={onPublishBrand.status === "loading"}
        size="small"
        type={brand?.is_published ? "danger" : "primary"}
        onClick={() =>
          onPublishBrand.mutate({
            slug: slug,
            shouldPublish: !brand.is_published,
          })
        }
      >
        {brand?.is_published ? "Unpublish" : "Publish"}
      </Button>
    );
  };

  return (
    <>
      <CustomPageHeader
        path="/category-list"
        title={brand?.name || parseSlug(slug)}
      />

      <div className="relative">
        <Descriptions column={2} layout="horizontal">
          <Descriptions.Item
            label={<strong className="font-medium">Brand Name</strong>}
            span={2}
          >
            {brand?.name}
          </Descriptions.Item>

          <Descriptions.Item
            label={<strong className="font-medium">Publish Status</strong>}
            span={2}
          >
            {brand?.is_published ? (
              <Tag color="green">PUBLISHED</Tag>
            ) : (
              <Tag color="red">UNPUBLISHED</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item
            label={<strong className="font-medium">Actions</strong>}
            span={2}
          >
            <Space>
              <PublishBrand />

              <Button
                size="small"
                onClick={() => navigate(`/product-list/add?brand=${slug}`)}
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
              brand?.brand_image?.full_size ||
              brand?.brand_image?.thumbnail ||
              DEFAULT_RASAN_IMAGE
            }
          />
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <TabAll slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <TabSKU slug={slug} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Brands;
