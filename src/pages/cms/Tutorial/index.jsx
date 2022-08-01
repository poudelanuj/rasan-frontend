import { Tabs } from "antd";
import { useQuery } from "react-query";
import CustomPageHeader from "../../../shared/PageHeader";
import TutorialList from "./TutorialList";
import TutorialTagsList from "./TutorialTagsList";
import { getTutorialTags, getAllTutorials } from "../../../api/tutorial";
import { GET_TAGLISTS, GET_TUTORIALS } from "../../../constants/queryKeys";

const Tutorial = () => {
  const { TabPane } = Tabs;

  const {
    data: tagList,
    status: tagStatus,
    refetch: refetchTags,
  } = useQuery({
    queryFn: () => getTutorialTags(),
    queryKey: GET_TAGLISTS,
  });

  const {
    data: tutorialList,
    status: tutorialStatus,
    refetch: refetchTutorials,
  } = useQuery({
    queryFn: () => getAllTutorials(),
    queryKey: GET_TUTORIALS,
  });

  return (
    <div className="py-5 px-4 bg-[#FFFFFF]">
      <CustomPageHeader title="Tutorial" />
      <Tabs defaultActiveKey="all">
        <TabPane key="tutorials" tab="Tutorials">
          <TutorialList
            dataSource={tutorialList}
            refetchTutorials={refetchTutorials}
            status={tutorialStatus}
          />
        </TabPane>
        <TabPane key="tutorial_tags" tab="Tutorial Tags">
          <TutorialTagsList
            dataSource={tagList}
            refetchTags={refetchTags}
            status={tagStatus}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Tutorial;
