import { Table, Tag, Button, Menu, Dropdown, Space, Input } from "antd";
import { useMutation } from "react-query";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBulkOrders } from "../../api/orders";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import getOrderStatusColor from "../../shared/tagColor";
import DeleteOrder from "./components/DeleteOrder";
import ButtonWPermission from "../../shared/ButtonWPermission";
import { isEmpty, capitalize } from "lodash";
import ConfirmDelete from "../../shared/ConfirmDelete";
import {
  CANCELLED_BY_CSR,
  CANCELLED_BY_CUSTOMER,
  IN_PROCESS,
} from "../../constants";

const OrdersList = ({
  dataSource,
  status,
  refetchOrders,
  page,
  setPage,
  pageSize,
  setPageSize,
  ordersCount,
  sortingFn,
  searchInput,
}) => {
  let timeout = 0;

  const [isDeleteOrderOpen, setIsDeleteOrderOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(0);

  const [isDeleteBulkOrderModal, setIsDeleteBulkOrderModal] = useState(false);

  const [checkedRows, setCheckedRows] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "orderId",
      render: (_, { id, status }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/orders/view-order/${id}`)}
          >
            #{id}
          </div>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "created_at"),
        };
      },
    },
    {
      title: "Customer",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      render: (_, { phone, customer_name, id }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/orders/view-order/${id}`)}
          >
            {customer_name ? `${customer_name} (${phone})` : phone}
          </div>
        );
      },
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_paid_amount",
      key: "total_paid_amount",
      render: (_, { total_paid_amount }) => {
        return <>Rs. {total_paid_amount}</>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "total_paid_amount"),
        };
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <>
            <Tag color={getOrderStatusColor(status)}>
              {status.toUpperCase().replaceAll("_", " ")}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
      render: (_, { payment }) => {
        return <>{capitalize(payment?.payment_method?.replaceAll("_", " "))}</>;
      },
    },
    {
      title: "Shop Name",
      dataIndex: "shop_name",
      key: "shop_name",
      width: "15%",
      render: (_, { shop_name }) => (
        <span className="w-16" style={{ overflowWrap: "anywhere" }}>
          {capitalize(shop_name?.replaceAll("_", " "))}
        </span>
      ),
    },
    {
      title: "Ordered At",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "created_at"),
        };
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, { id, status }) => {
        return (
          <>
            <ButtonWPermission
              className="!border-none !bg-inherit"
              codename="delete_order"
              disabled={
                status !== CANCELLED_BY_CSR && status !== CANCELLED_BY_CUSTOMER
              }
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsDeleteOrderOpen((prev) => !prev);
                setDeleteOrderId(id);
              }}
            />
          </>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: checkedRows,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
      {
        key: "without_progress",
        text: " Select without progress",

        onSelect: (rowKeys) => {
          setCheckedRows(
            rowKeys.filter(
              (key) =>
                dataSource?.find((item) => item.id === key)?.status !==
                IN_PROCESS
            )
          );
        },
      },
    ],

    onChange: (selectedRowKeys, selectedRows) => {
      setCheckedRows(selectedRows.map((item) => item.id));
    },
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  const handleDeleteBulk = useMutation(() => deleteBulkOrders(checkedRows), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Orders Deleted");
      refetchOrders();
      setIsDeleteBulkOrderModal(false);
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_order"
              disabled={
                isEmpty(checkedRows) ||
                !checkedRows.every(
                  (id) =>
                    dataSource?.find((item) => item.id === id).status ===
                      CANCELLED_BY_CSR || status === CANCELLED_BY_CUSTOMER
                )
              }
              onClick={() => setIsDeleteBulkOrderModal(true)}
            >
              Delete
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <div className="mb-4 flex sm:gap-5 gap-2 justify-between sm:flex-row flex-col">
        <div className="flex sm:flex-row flex-col gap-2">
          <ButtonWPermission
            codename="add_order"
            type="primary"
            ghost
            onClick={() => {
              navigate("/orders/create-order");
            }}
          >
            Create New Order
          </ButtonWPermission>

          <Input.Search
            className={`${window.innerWidth < 700 && "!w-full"}`}
            placeholder="Search user, contact, shop"
            onChange={(e) => {
              searchInput.current = e.target.value;
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(refetchOrders, 400);
            }}
          />
        </div>

        <Space className="justify-end">
          <Dropdown overlay={bulkMenu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>

          <Button className="bg-cyan-500 text-white" type="default">
            <Space>Export</Space>
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource?.map((item) => ({ ...item, key: item.id }))}
        loading={status === "loading"}
        pagination={{
          showSizeChanger: true,
          pageSize,
          total: ordersCount,
          current: page,

          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        rowSelection={{ ...rowSelection }}
        scroll={{ x: 1000 }}
        showSorterTooltip={false}
      />

      <DeleteOrder
        closeModal={() => setIsDeleteOrderOpen(false)}
        isOpen={isDeleteOrderOpen}
        orderId={deleteOrderId}
        refetchOrders={refetchOrders}
        title={"Order #" + deleteOrderId}
      />

      <ConfirmDelete
        closeModal={() => setIsDeleteBulkOrderModal(false)}
        deleteMutation={() => handleDeleteBulk.mutate()}
        isOpen={isDeleteBulkOrderModal}
        status={handleDeleteBulk.status}
        title="Delete selected orders?"
      />
    </>
  );
};

export default OrdersList;
