import { Tabs } from "antd";
import CustomPageHeader from "../../../shared/PageHeader";
import CustomerStories from "./CustomerStories";
import FAQS from "./FAQS";
import VideoLinks from "./VideoLinks";

const About = () => {
  const { TabPane } = Tabs;
  return (
    <>
      <CustomPageHeader title="About Us" isBasicHeader />
      <div className="py-5 px-4 bg-[#FFFFFF]">
        <Tabs defaultActiveKey="faqs">
          <TabPane key="faqs" tab="FAQS">
            <FAQS />
          </TabPane>
          <TabPane key="customer_stories" tab="Customer Stories">
            <CustomerStories />
          </TabPane>
          <TabPane key="video_links" tab="Video Links">
            <VideoLinks />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default About;
