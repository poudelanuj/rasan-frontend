import React, { useState, useEffect, useRef } from "react";
import { Table, Dropdown, Button, Space, Menu, Input, Spin } from "antd";
import { useQuery, useMutation } from "react-query";
import { uniqBy, isEmpty } from "lodash";
import moment from "moment";
import BasketInfo from "./BasketInfo";
import BasketModal from "./BasketModal";
import ButtonWPermission from "../../shared/ButtonWPermission";
import { deleteBulkUserBasket, getAllBaskets } from "../../api/baskets";
import { GET_BASKETS } from "../../constants/queryKeys";
import { openErrorNotification, openSuccessNotification } from "../../utils";
import ConfirmDelete from "../../shared/ConfirmDelete";

const LiveUserBasket = () => {
  const { Search } = Input;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalBasket, setModalBasket] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [basketList, setBasketList] = useState([]);

  const searchText = useRef();

  let timeout = 0;

  const pageSize = 20;

  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => getAllBaskets(page, pageSize, searchText.current),
    queryKey: [
      GET_BASKETS,
      page.toString() + pageSize.toString(),
      searchText.current,
    ],
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

  const handleBulkDelete = useMutation(
    () => deleteBulkUserBasket(selectedRowKeys),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetch();
        setSelectedRowKeys([]);
        setIsBulkDeleteModalOpen(false);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

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

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_basket"
              disabled={isEmpty(selectedRowKeys)}
              onClick={() => setIsBulkDeleteModalOpen(true)}
            >
              Delete
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  const rowSelection = {
    selectedRowKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    onChange: (selectedRows) => {
      setSelectedRowKeys(selectedRows);
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl my-3">Live User Basket</h2>

        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </div>
      <Search
        className="mb-4"
        enterButton="Search"
        placeholder="Search User"
        size="large"
        onChange={(e) => {
          searchText.current = e.target.value;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(refetch, 400);
        }}
      />

      {isLoading && <Spin />}
      <Table
        columns={columns}
        dataSource={basketList?.map((item) => ({
          ...item,
          key: item.basket_id,
        }))}
        loading={isLoading}
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

      <ConfirmDelete
        closeModal={() => setIsBulkDeleteModalOpen(false)}
        deleteMutation={() => handleBulkDelete.mutate()}
        isOpen={isBulkDeleteModalOpen}
        status={() => handleBulkDelete.status}
        title="Delete selected basket?"
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
