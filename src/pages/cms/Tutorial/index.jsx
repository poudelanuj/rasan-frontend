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
    isRefetching: refetchingTags,
  } = useQuery({
    queryFn: () => getTutorialTags(),
    queryKey: GET_TAGLISTS,
  });

  const {
    data: tutorialList,
    status: tutorialStatus,
    refetch: refetchTutorials,
    isRefetching: refetchingTutorials,
  } = useQuery({
    queryFn: () => getAllTutorials(),
    queryKey: GET_TUTORIALS,
  });

  return (
    <div className="py-5 px-4 bg-[#FFFFFF]">
      <CustomPageHeader title="Tutorial" isBasicHeader />
      <Tabs defaultActiveKey="all">
        <TabPane key="tutorials" tab="Tutorials">
          <TutorialList
            dataSource={tutorialList}
            refetchTutorials={refetchTutorials}
            refetchingTutorials={refetchingTutorials}
            status={tutorialStatus}
          />
        </TabPane>
        <TabPane key="tutorial_tags" tab="Tutorial Tags">
          <TutorialTagsList
            dataSource={tagList}
            refetchTags={refetchTags}
            refetchingTags={refetchingTags}
            status={tagStatus}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Tutorial;
