import { Tabs } from "antd";
import CustomPageHeader from "../../shared/PageHeader";
import Deals from "./Deals";
import { PUBLISHED, UNPUBLISHED } from "../../constants";
import {
  GET_LOYALTY_REDEEM_ARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL,
  GET_LOYALTY_REDEEM_UNARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL,
} from "../../constants/queryKeys";

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

  return (
    <>
      <CustomPageHeader title="Loyalty Redeem" isBasicHeader />
      <div className="py-5 px-4 bg-[#FFFFFF]">
        <Tabs defaultActiveKey="all">
          {/* Todo Right Align*/}
          <TabPane key="unarchived" tab="Active">
            <Tabs>
              <TabPane key="rasan_deals_unarchived" tab="Rasan Deals">
                <Deals
                  isArchived={"False"}
                  queryKey={GET_LOYALTY_REDEEM_UNARCHIVED_RASAN}
                  type="rasan_deal"
                />
              </TabPane>

              <TabPane key="special_deals_unarchived" tab="Special Deals">
                <Deals
                  isArchived={"False"}
                  queryKey={GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL}
                  type="special_deal"
                />
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane key="archived" tab="Archived">
            <Tabs>
              <TabPane key="rasan_deals_archived" tab="Rasan Deals">
                <Deals
                  isArchived={"True"}
                  queryKey={GET_LOYALTY_REDEEM_ARCHIVED_RASAN}
                  type="rasan_deal"
                />
              </TabPane>

              <TabPane key="special_deals_archived" tab="Special Deals">
                <Deals
                  isArchived={"True"}
                  queryKey={GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL}
                  type="special_deal"
                />
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default LoyaltyRedeem;
