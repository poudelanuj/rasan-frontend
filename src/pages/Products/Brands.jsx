import React from "react";
import TabAll from "./Brands/TabAll";
import TabSKU from "./Brands/TabSKU";
import { useMutation, useQuery } from "react-query";

import { Button, Tabs } from "antd";
import { useParams } from "react-router-dom";
import CustomPageHeader from "../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../utils";
import { getBrand, publishBrand } from "../../api/brands";
import { GET_SINGLE_BRAND } from "../../constants/queryKeys";
const { TabPane } = Tabs;

function Brands() {
  const { slug } = useParams();

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
        type={brand?.is_published ? "danger" : "primary"}
        onClick={() =>
          onPublishBrand.mutate({
            slug: brand.slug,
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
      <div className="mt-4">
        <CustomPageHeader
          path="/category-list"
          title={brand?.name || parseSlug(slug)}
        />
      </div>

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <TabAll publishBrand={<PublishBrand />} slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <TabSKU publishBrand={<PublishBrand />} slug={slug} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Brands;
