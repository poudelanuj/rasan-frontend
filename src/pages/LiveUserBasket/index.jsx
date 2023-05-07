import React, { useState, useEffect, useRef } from "react";
import { Table, Dropdown, Button, Space, Menu, Input } from "antd";
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
import CustomPageHeader from "../../shared/PageHeader";
import { useAuth } from "../../AuthProvider";

const LiveUserBasket = () => {
  const { isMobileView } = useAuth();

  const { Search } = Input;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalBasket, setModalBasket] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [basketList, setBasketList] = useState([]);

  const [sortObj, setSortObj] = useState({
    sortType: {
      number_of_items: false,
      last_edited_at: false,
    },
    sort: [],
  });

  const searchText = useRef();

  let timeout = 0;

  const [pageSize, setPageSize] = useState(20);

  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching, status } = useQuery({
    queryFn: () =>
      getAllBaskets(page, pageSize, searchText.current, sortObj.sort),
    queryKey: [
      GET_BASKETS,
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setBasketList([]);
      setBasketList((prev) => uniqBy([...prev, ...data.results], "basket_id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj, pageSize]);

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

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [
        `${sortObj.sortType[name] ? "" : "-"}${
          header.dataIndex === "id" ? "created_at" : header.dataIndex
        }`,
      ],
    });

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      width: "30%",
      render: (_, { user }) => (
        <span className="w-16" style={{ overflowWrap: "anywhere" }}>
          {user?.full_name}
        </span>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      width: "30%",
      render: (_, { user }) => <>{user?.phone}</>,
    },
    {
      title: "Total Items",
      dataIndex: "number_of_items",
      render: (_, { number_of_items }) => (
        <BasketInfo itemsCount={number_of_items} />
      ),
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "number_of_items"),
        };
      },
    },
    {
      title: "Updated At",
      dataIndex: "last_edited_at",
      render: (_, { last_edited_at }) => {
        return <>{moment(last_edited_at).format("ll")}</>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "last_edited_at"),
        };
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
    <>
      <CustomPageHeader title="Live User Basket" isBasicHeader>
        <Dropdown overlay={bulkMenu}>
          <Button className="bg-white" type="default">
            <Space>Bulk Actions</Space>
          </Button>
        </Dropdown>
      </CustomPageHeader>

      <div className="bg-white p-6 rounded-lg">
        <Search
          className="mb-4"
          enterButton="Search"
          placeholder="Search User"
          size="large"
          onChange={(e) => {
            searchText.current = e.target.value;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
              setPage(1);
              refetch();
            }, 400);
          }}
        />

        <Table
          columns={columns}
          dataSource={basketList?.map((item) => ({
            ...item,
            key: item.basket_id,
          }))}
          loading={isLoading}
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
          scroll={{ x: isEmpty(basketList) && !isMobileView ? null : 1000 }}
          showSorterTooltip={false}
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
    </>
  );
};

export default LiveUserBasket;
