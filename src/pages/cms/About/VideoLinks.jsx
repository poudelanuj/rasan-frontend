import { Button, Dropdown, Space, Menu, Card, Badge, Pagination } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getVideoLinks } from "../../../api/aboutus";
import { GET_VIDEO_LINKS } from "../../../constants/queryKeys";
import CreateVideoLinksModal from "./components/CreateVideoLinksModal";
import UpdateVideoLinksModal from "./components/UpdateVideoLinksModal";
import Loader from "../../../shared/Loader";
import { useEffect } from "react";
import { uniqBy } from "lodash";

const VideoLinks = () => {
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [videoLinks, setVideoLinks] = useState([]);

  const [isCreateVideoLinkModalOpen, setIsCreateVideoLinkModalOpen] =
    useState(false);

  const [isUpdateVideoLinkModalOpen, setIsUpdateVideoLinkModalOpen] =
    useState(false);

  const [videoId, setVideoId] = useState(null);

  const {
    data,
    refetch: refetchVideoLinks,
    status,
    isRefetching,
  } = useQuery({
    queryFn: () => getVideoLinks({ page, pageSize }),
    queryKey: [GET_VIDEO_LINKS],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setVideoLinks([]);
      setVideoLinks((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchVideoLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: <div>Delete</div>,
        },
      ]}
    />
  );

  return (
    <>
      {status === "loading" || isRefetching ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <Button
              className="flex items-center"
              type="primary"
              ghost
              onClick={() => setIsCreateVideoLinkModalOpen(true)}
            >
              Create Video Link
            </Button>

            <Dropdown overlay={bulkMenu}>
              <Button className="bg-white" type="default">
                <Space>Bulk Actions</Space>
              </Button>
            </Dropdown>
          </div>

          <div className="w-full grid grid-cols-4 gap-6">
            {videoLinks &&
              videoLinks.map((el) => (
                <Badge.Ribbon
                  key={el.id}
                  color={!el.is_published && "orange"}
                  text={el.is_published ? "Published" : "Not Published"}
                >
                  <Card
                    key={el.id}
                    className="shadow-md"
                    cover={
                      <img
                        alt="Thumbnail"
                        className="object-cover h-[170px]"
                        src={el.image?.thumbnail}
                      />
                    }
                    style={{ height: 275 }}
                    hoverable
                    onClick={() => {
                      setVideoId(el.id);
                      setIsUpdateVideoLinkModalOpen(true);
                    }}
                  >
                    <p
                      className="font-semibold"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {el.video_url}
                    </p>
                  </Card>
                </Badge.Ribbon>
              ))}

            <Pagination
              className="col-span-full w-full flex justify-end"
              current={page}
              pageSize={pageSize}
              total={data?.count}
              showSizeChanger
              onChange={(page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              }}
            />
          </div>

          <CreateVideoLinksModal
            isCreateVideoLinkModalOpen={isCreateVideoLinkModalOpen}
            refetchVideoLinks={refetchVideoLinks}
            setIsCreateVideoLinkModalOpen={setIsCreateVideoLinkModalOpen}
          />

          <UpdateVideoLinksModal
            isUpdateVideoLinkModalOpen={isUpdateVideoLinkModalOpen}
            refetchVideoLinks={refetchVideoLinks}
            setIsUpdateVideoLinkModalOpen={setIsUpdateVideoLinkModalOpen}
            videoId={videoId}
          />
        </>
      )}
    </>
  );
};

export default VideoLinks;
