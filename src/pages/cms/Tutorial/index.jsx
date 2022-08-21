import { Tabs } from "antd";
import CustomPageHeader from "../../../shared/PageHeader";
import TutorialList from "./TutorialList";
import TutorialTagsList from "./TutorialTagsList";

const Tutorial = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <CustomPageHeader title="Tutorial" isBasicHeader />
      <div className="py-5 px-4 bg-[#FFFFFF]">
        <Tabs defaultActiveKey="all">
          <TabPane key="tutorials" tab="Tutorials">
            <TutorialList />
          </TabPane>
          <TabPane key="tutorial_tags" tab="Tutorial Tags">
            <TutorialTagsList />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Tutorial;
