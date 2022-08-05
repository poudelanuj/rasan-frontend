import { Button, Dropdown, Space, Card, Badge, Menu } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getCustomerStories } from "../../../api/aboutus";
import { GET_CUSTOMER_STORIES } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CreateCustomerStoriesModal from "./components/CreateCustomerStoriesModal";
import UpdateCustomerStoriesModal from "./components/UpdateCustomerStoriesModal";

const CustomerStories = () => {
  const { Meta } = Card;

  const [
    isCreateCustomerStoriesModalOpen,
    setIsCreateCustomerStoriesModalOpen,
  ] = useState(false);

  const [customerId, setCustomerId] = useState(null);

  const [
    isUpdateCustomerStoriesModalOpen,
    setIsUpdateCustomerStoriesModalOpen,
  ] = useState(false);

  const {
    data: dataSource,
    refetch: refetchCustomerStories,
    isFetching,
  } = useQuery({
    queryFn: () => getCustomerStories(),
    queryKey: GET_CUSTOMER_STORIES,
  });

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
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <Button
              className="flex items-center"
              type="primary"
              ghost
              onClick={() => setIsCreateCustomerStoriesModalOpen(true)}
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
            {dataSource &&
              dataSource.map((el) => (
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
          </div>

          <CreateCustomerStoriesModal
            isCreateCustomerStoriesModalOpen={isCreateCustomerStoriesModalOpen}
            refetchCustomerStories={refetchCustomerStories}
            setIsCreateCustomerStoriesModalOpen={
              setIsCreateCustomerStoriesModalOpen
            }
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
