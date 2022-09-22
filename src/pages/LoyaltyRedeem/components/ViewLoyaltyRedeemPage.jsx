import { capitalize } from "lodash";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Image, Tag } from "antd";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";
import {
  archiveRedeemableProduct,
  getRedeemableProductById,
} from "../../../api/loyaltyRedeem";
import {
  GET_LOYALTY_REDEEM_BY_ID,
  GET_PRODUCT_SKU,
} from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import { getStatusColor } from "..";
import { getProductSku } from "../../../api/products/productSku";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import { useState } from "react";
import UpdateLoyaltyRedeemModal from "./UpdateLoyaltyRedeemModal";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const ViewLoyaltyRedeemPage = () => {
  const { loyaltyRedeemId } = useParams();

  const [isUpdateLoyaltyRedeemOpen, setIsUpdateLoyaltyRedeemOpen] =
    useState(false);

  const {
    data: loyaltyRedeem,
    status,
    refetch: refetchLoyaltyRedeem,
  } = useQuery({
    queryFn: () => getRedeemableProductById(loyaltyRedeemId),
    queryKey: [GET_LOYALTY_REDEEM_BY_ID, loyaltyRedeemId],
    enabled: !!loyaltyRedeemId,
  });

  const { data: productSku, status: productSkuStatus } = useQuery({
    queryFn: () => getProductSku(loyaltyRedeem && loyaltyRedeem.product_sku),
    queryKey: [GET_PRODUCT_SKU, loyaltyRedeemId],
    enabled: !!loyaltyRedeemId && !!loyaltyRedeem,
  });

  const handleArchiveLoyalty = useMutation(
    ({ id, shouldArchive }) => archiveRedeemableProduct({ id, shouldArchive }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchLoyaltyRedeem();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  return (
    <>
      {status === "loading" || productSkuStatus === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        <>
          {loyaltyRedeem && (
            <>
              <CustomPageHeader
                title={loyaltyRedeem.product_sku.replaceAll("-", " ")}
              />

              <div className="py-5 px-4 bg-[#FFFFFF]">
                <div className="flex w-full justify-between items-start">
                  <div className="flex gap-7">
                    <Image
                      height={200}
                      src={productSku && productSku.product_sku_image.full_size}
                    />

                    <div className="flex flex-col">
                      <p>
                        Created at:{" "}
                        <span className="font-semibold">
                          {moment(loyaltyRedeem.created_at).format("ll")}
                        </span>
                      </p>
                      <p>
                        Last Edited at:{" "}
                        <span className="font-semibold">
                          {moment(loyaltyRedeem.last_edited_at).format("ll")}
                        </span>
                      </p>
                      <p>
                        Published at:{" "}
                        <span className="font-semibold">
                          {loyaltyRedeem.published_at
                            ? moment(loyaltyRedeem.published_at).format("ll")
                            : "Not Published"}
                        </span>
                      </p>
                      <Tag
                        className="text-center w-fit"
                        color={
                          loyaltyRedeem.is_published
                            ? getStatusColor(PUBLISHED)
                            : getStatusColor(UNPUBLISHED)
                        }
                      >
                        {loyaltyRedeem.is_published
                          ? "Published"
                          : "Not published"}
                      </Tag>
                    </div>
                  </div>

                  <ButtonWPermission
                    className="!text-[#00A0B0] !bg-inherit !border-none !flex items-center"
                    codename="change_loyalty"
                    onClick={() => setIsUpdateLoyaltyRedeemOpen(true)}
                  >
                    <EditOutlined /> Edit Details
                  </ButtonWPermission>
                </div>

                <div className="grid grid-cols-2 pt-8 text-md">
                  <p className="text-lg font-semibold col-span-full">
                    Product Details
                  </p>

                  <p>
                    ID:{" "}
                    <span className="font-semibold">#{loyaltyRedeem.id}</span>
                  </p>

                  <p>
                    Loyalty Points:{" "}
                    <span className="font-semibold">
                      {loyaltyRedeem.loyalty_points}
                    </span>
                  </p>

                  <p>
                    Product SKU:{" "}
                    <span className="font-semibold">
                      {capitalize(loyaltyRedeem.product_sku).replaceAll(
                        "-",
                        " "
                      )}
                    </span>
                  </p>

                  <p>
                    Total Quota:{" "}
                    <span className="font-semibold">{loyaltyRedeem.quota}</span>
                  </p>

                  <p>
                    Redeem Type:{" "}
                    <span className="font-semibold">
                      {capitalize(loyaltyRedeem.redeem_type).replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </p>

                  <p>
                    Redeemed Items:{" "}
                    <span className="font-semibold">
                      {loyaltyRedeem.redeems_made}
                    </span>
                  </p>

                  <ButtonWPermission
                    className="w-fit mt-1"
                    codename="change_loyalty"
                    danger={loyaltyRedeem.is_archived}
                    loading={handleArchiveLoyalty.isLoading}
                    type="primary"
                    onClick={() =>
                      handleArchiveLoyalty.mutate({
                        id: loyaltyRedeemId,
                        shouldArchive: !loyaltyRedeem.is_archived,
                      })
                    }
                  >
                    {loyaltyRedeem.is_archived ? "Unarchive" : "Archive"}
                  </ButtonWPermission>
                </div>
              </div>

              <UpdateLoyaltyRedeemModal
                closeModal={() => setIsUpdateLoyaltyRedeemOpen(false)}
                id={loyaltyRedeemId}
                image={productSku && productSku.product_sku_image.full_size}
                isOpen={isUpdateLoyaltyRedeemOpen}
                loyaltyPoints={loyaltyRedeem.loyalty_points}
                productSku={loyaltyRedeem.product_sku}
                quota={loyaltyRedeem.quota}
                redeemType={loyaltyRedeem.redeem_type}
                refetch={refetchLoyaltyRedeem}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewLoyaltyRedeemPage;
