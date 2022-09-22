import { Table, Tag, Button, Menu, Dropdown, Space, Input } from "antd";
import { useMutation } from "react-query";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBulkOrders } from "../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import DeleteOrder from "./components/DeleteOrder";
import ButtonWPermission from "../../shared/ButtonWPermission";
import { isEmpty, capitalize } from "lodash";

export const getOrderStatusColor = (status) => {
  switch (status) {
    case IN_PROCESS:
      return "orange";
    case CANCELLED:
      return "red";
    case DELIVERED:
      return "green";
    default:
      return "green";
  }
};

const OrdersList = ({
  dataSource,
  status,
  refetchOrders,
  page,
  setPage,
  pageSize,
  ordersCount,
}) => {
  const searchInput = useRef(null);
  const [isDeleteOrderOpen, setIsDeleteOrderOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(0);

  const [checkedRows, setCheckedRows] = useState([]);
  const navigate = useNavigate();

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {}}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "orderId",
      render: (_, { id, status }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`view-order/${id}`)}
          >
            #{id}
          </div>
        );
      },
      ...getColumnSearchProps("order Id"),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      ...getColumnSearchProps("customer"),
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: (_, { user, id }) => {
        return (
          <div
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`view-order/${id}`)}
          >
            {user}
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
      ...getColumnSearchProps("price"),
      sorter: (a, b) => a.total_paid_amount - b.total_paid_amount,
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
      ...getColumnSearchProps("delivery status"),
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
      render: (_, { payment }) => {
        return <>{capitalize(payment?.payment_method?.replaceAll("_", " "))}</>;
      },
      ...getColumnSearchProps("payment method"),
    },
    {
      title: "Ordered At",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
      sorter: (a, b) => a.created_at - b.created_at,
      ...getColumnSearchProps("delivery date"),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, { id, status }) => {
        return (
          <>
            <DeleteOutlined
              className="ml-5"
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
      if (checkedRows.length) openSuccessNotification("Orders Deleted");
      refetchOrders();
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
              disabled={isEmpty(checkedRows)}
              onClick={() => handleDeleteBulk.mutate()}
            >
              Delete
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <ButtonWPermission
          className="flex items-center"
          codename="add_order"
          type="primary"
          ghost
          onClick={() => {
            navigate("create-order");
          }}
        >
          Create New Order
        </ButtonWPermission>

        <div>
          <Dropdown overlay={bulkMenu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>

          <Button className="ml-4 bg-cyan-500 text-white" type="default">
            <Space>Export</Space>
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource?.map((item) => ({ ...item, key: item.id }))}
        loading={status === "loading"}
        pagination={{
          pageSize,
          total: ordersCount,
          current: page,

          onChange: (page, pageSize) => {
            setPage(page);
          },
        }}
        rowSelection={{ ...rowSelection }}
      />

      <DeleteOrder
        closeModal={() => setIsDeleteOrderOpen(false)}
        isOpen={isDeleteOrderOpen}
        orderId={deleteOrderId}
        refetchOrders={refetchOrders}
        title={"Order #" + deleteOrderId}
      />
    </div>
  );
};

export default OrdersList;
