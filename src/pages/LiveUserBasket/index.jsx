import React, { useState } from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
import moment from "moment";
import UserInfo from "./UserInfo";
import BasketInfo from "./BasketInfo";
import BasketModal from "./BasketModal";
import { getAllBaskets } from "../../api/baskets";
import { GET_BASKETS } from "../../constants/queryKeys";

const LiveUserBasket = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalBasket, setModalBasket] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: basketsList, status } = useQuery({
    queryFn: () => getAllBaskets(),
    queryKey: GET_BASKETS,
  });

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      render: (_, { user }) => <UserInfo user={user} />,
    },
    {
      title: "Total Items",
      dataIndex: "totalItems",
      render: (_, { number_of_items }) => (
        <BasketInfo itemsCount={number_of_items} />
      ),
    },
    {
      title: "Updated At",
      dataIndex: "last_edited_at",
      render: (_, { last_edited_at }) => {
        return <>{moment(last_edited_at).format("ll")}</>;
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    onChange: onSelectChange,
  };

  return (
    <div>
      <h2 className="text-2xl my-3">Live User Basket</h2>

      <Table
        columns={columns}
        dataSource={basketsList?.map((item) => ({ ...item, key: item.user }))}
        loading={status === "loading"}
        rowClassName="cursor-pointer"
        rowSelection={rowSelection}
        onRow={(record) => {
          return {
            onClick: () => {
              setModalBasket(record);
              setIsModalOpen(true);
            },
          };
        }}
      />

      {modalBasket && (
        <BasketModal
          basket={modalBasket}
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LiveUserBasket;
