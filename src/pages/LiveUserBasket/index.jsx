import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
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

  const [basketList, setBasketList] = useState([]);

  const pageSize = 20;

  const [page, setPage] = useState(1);

  const { data, status, refetch } = useQuery({
    queryFn: () => getAllBaskets(page, pageSize),
    queryKey: [GET_BASKETS, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setBasketList([]);
      setBasketList((prev) => uniqBy([...prev, ...data.results], "basket_id"));
    }
  }, [data]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
        dataSource={basketList?.map((item) => ({
          ...item,
          key: item.basket_id,
        }))}
        loading={status === "loading"}
        pagination={{
          pageSize,
          total: data?.count,

          onChange: (page, pageSize) => setPage(page),
        }}
        rowClassName="cursor-pointer"
        rowSelection={{ ...rowSelection }}
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
