import { Button, Dropdown, Space, Card, Badge, Menu, Pagination } from "antd";
import { useState, useEffect } from "react";
import { uniqBy } from "lodash";
import { useQuery } from "react-query";
import { getCustomerStories } from "../../../api/aboutus";
import { GET_CUSTOMER_STORIES } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CreateCustomerStoriesModal from "./components/CreateCustomerStoriesModal";
import UpdateCustomerStoriesModal from "./components/UpdateCustomerStoriesModal";

const CustomerStories = () => {
  const { Meta } = Card;

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [customerStories, setCustomerStories] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [customerId, setCustomerId] = useState(null);

  const [
    isUpdateCustomerStoriesModalOpen,
    setIsUpdateCustomerStoriesModalOpen,
  ] = useState(false);

  const {
    data,
    status,
    refetch: refetchCustomerStories,
    isRefetching,
  } = useQuery({
    queryFn: () => getCustomerStories({ page, pageSize }),
    queryKey: [GET_CUSTOMER_STORIES],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setCustomerStories([]);
      setCustomerStories((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetchCustomerStories();
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
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Customer Stories
            </Button>

            <Dropdown overlay={bulkMenu}>
              <Button className="bg-white" type="default">
                <Space>Bulk Actions</Space>
              </Button>
            </Dropdown>
          </div>

          <div className="w-full grid grid-cols-4 gap-6">
            {customerStories &&
              customerStories.map((el) => (
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
                        className="object-cover h-[180px]"
                        src={el.image.thumbnail}
                      />
                    }
                    style={{ height: 275 }}
                    hoverable
                    onClick={() => {
                      setCustomerId(el.id);
                      setIsUpdateCustomerStoriesModalOpen(true);
                    }}
                  >
                    <Meta description={el.shop_name} title={el.full_name} />
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

          <CreateCustomerStoriesModal
            isCreateModalOpen={isCreateModalOpen}
            refetchCustomerStories={refetchCustomerStories}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />

          <UpdateCustomerStoriesModal
            customerId={customerId}
            isUpdateCustomerStoriesModalOpen={isUpdateCustomerStoriesModalOpen}
            refetchCustomerStories={refetchCustomerStories}
            setIsUpdateCustomerStoriesModalOpen={
              setIsUpdateCustomerStoriesModalOpen
            }
          />
        </>
      )}
    </>
  );
};

export default CustomerStories;
