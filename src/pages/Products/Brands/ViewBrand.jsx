import React, { useCallback } from "react";
import { useMutation, useQuery } from "react-query";

import { Breadcrumb, Image, Tabs, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import TabAll from "./Tabs/TabAll";
import TabSKU from "./Tabs/TabSKU";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
  parseSlug,
} from "../../../utils";
import { getBrand, publishBrand } from "../../../api/brands";
import { GET_SINGLE_BRAND } from "../../../constants/queryKeys";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import { useState } from "react";
import EditBrand from "./EditBrand";
import { BrandAnalytics } from "./Tabs/BrandAnalytics";
const { TabPane } = Tabs;

function Brands() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isEditBrand, setIsEditBrand] = useState(false);

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
        openSuccessNotification(data.message || "Brand Updated"),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchBrand(),
    }
  );

  const PublishBrand = () => {
    return (
      <ButtonWPermission
        codename="change_brand"
        disabled={status === "loading"}
        loading={onPublishBrand.status === "loading"}
        type={brand?.is_published ? "danger" : "primary"}
        onClick={() =>
          onPublishBrand.mutate({
            slug: slug,
            shouldPublish: !brand.is_published,
          })
        }
      >
        {brand?.is_published ? "Unpublish" : "Publish"}
      </ButtonWPermission>
    );
  };

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/brands">Brands</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{brand?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, [brand]);

  const getHeaderAvatarProps = useCallback(() => {
    return {
      size: 60,
      src: (
        <Image
          className="bg-white rounded"
          height={60}
          src={
            brand?.brand_image?.full_size ||
            brand?.brand_image?.thumbnail ||
            DEFAULT_RASAN_IMAGE
          }
        />
      ),
    };
  }, [brand]);

  const getPublishTag = useCallback(() => {
    return brand?.is_published ? (
      <Tag color="green">PUBLISHED</Tag>
    ) : (
      <Tag color="red">UNPUBLISHED</Tag>
    );
  }, [brand]);

  return (
    <>
      <CustomPageHeader
        avatar={getHeaderAvatarProps()}
        breadcrumb={getHeaderBreadcrumb()}
        extra={[
          <div key="btn" className="flex sm:flex-row flex-col gap-2">
            <PublishBrand key="1" />
            <ButtonWPermission
              key="2"
              codename="add_product"
              onClick={() => navigate(`/product-list/add?brand=${slug}`)}
            >
              Add New Products
            </ButtonWPermission>
            <ButtonWPermission
              key="3"
              codename="change_brand"
              type="primary"
              onClick={() => setIsEditBrand(true)}
            >
              Edit Brand
            </ButtonWPermission>
          </div>,
        ]}
        path="/brands"
        subTitle={getPublishTag()}
        title={brand?.name || parseSlug(slug)}
      />

      <EditBrand
        closeModal={() => setIsEditBrand(false)}
        isOpen={isEditBrand}
        slug={slug}
      />

      <div className="bg-white p-6 rounded-lg">
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="Products">
            <TabAll slug={slug} />
          </TabPane>
          <TabPane key="2" tab="SKU">
            <TabSKU slug={slug} />
          </TabPane>
          <TabPane key="3" tab="Brand Analytics">
            {brand && <BrandAnalytics brand_id={brand.id} />}
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Brands;
