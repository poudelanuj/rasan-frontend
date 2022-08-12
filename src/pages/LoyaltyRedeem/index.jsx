import { Tabs } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { getRedeemableProduct } from "../../api/loyaltyRedeem";
import { GET_LOYALTY_REDEEM } from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import Deals from "./Deals";
import { PUBLISHED, UNPUBLISHED } from "../../constants";

export const getStatusColor = (status) => {
  switch (status) {
    case PUBLISHED:
      return "green";
    case UNPUBLISHED:
      return "orange";
    default:
      return "green";
  }
};

const LoyaltyRedeem = () => {
  const { TabPane } = Tabs;

  const [specialDeals, setSpecialDeals] = useState([]);

  const [rasanDeals, setRasanDeals] = useState([]);

  const {
    data: loyaltyRedeem,
    status,
    refetch: refetchLoyaltyRedeem,
  } = useQuery({
    queryFn: () => getRedeemableProduct(),
    queryKey: [GET_LOYALTY_REDEEM],
  });

  useEffect(() => {
    if (status === "success") {
      setRasanDeals(
        loyaltyRedeem.filter((el) => el.redeem_type === "rasan_deal")
      );
      setSpecialDeals(
        loyaltyRedeem.filter((el) => el.redeem_type === "special_deal")
      );
    }
  }, [loyaltyRedeem, status]);

  return (
    <>
      <CustomPageHeader title="Loyalty Redeem" isBasicHeader />
      <div className="py-5 px-4 bg-[#FFFFFF]">
        <Tabs defaultActiveKey="all">
          <TabPane key="special_deals" tab="Special Deals">
            {status === "loading" ? (
              <Loader isOpen={true} />
            ) : (
              <Deals
                deals={specialDeals}
                refetchLoyaltyRedeem={refetchLoyaltyRedeem}
                status={status}
              />
            )}
          </TabPane>

          <TabPane key="rasan_deals" tab="Rasan Deals">
            {status === "loading" ? (
              <Loader isOpen={true} />
            ) : (
              <Deals
                deals={rasanDeals}
                refetchLoyaltyRedeem={refetchLoyaltyRedeem}
                status={status}
              />
            )}
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default LoyaltyRedeem;
