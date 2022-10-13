import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import moment from "moment";
import BasketInfo from "../../pages/LiveUserBasket/BasketInfo";
import BasketModal from "../../pages/LiveUserBasket/BasketModal";
import { getUserBasket } from "../../api/baskets";
import { GET_USER_BASKET } from "../../constants/queryKeys";

const LiveUserBasket = ({ user }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalBasket, setModalBasket] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [basketList, setBasketList] = useState([]);

  const [pageSize, setPageSize] = useState(20);

  const [page, setPage] = useState(1);

  const { data, status, refetch } = useQuery({
    queryFn: () =>
      getUserBasket(user.phone.replace("+977-", ""), page, pageSize),
    queryKey: [GET_USER_BASKET, page.toString() + pageSize.toString()],
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
  }, [page, pageSize]);

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      render: (_, { user }) => <>{user?.full_name}</>,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      render: (_, { user }) => <>{user?.phone}</>,
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
      <Table
        columns={columns}
        dataSource={basketList?.map((item) => ({
          ...item,
          key: item.basket_id,
        }))}
        loading={status === "loading"}
        pagination={{
          showSizeChanger: true,
          pageSize,
          total: data?.count,
          current: page,

          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
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
