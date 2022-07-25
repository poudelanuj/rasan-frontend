import {
  Table,
  Tag,
  Button,
  Menu,
  Dropdown,
  Space,
  Input,
  Spin,
  Select,
  notification,
} from "antd";
import { useMutation } from "react-query";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OrderModal from "./components/ViewOrder";
import {
  deleteBulkOrders,
  updateOrderStatus,
} from "../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import { CANCELLED, DELIVERED, IN_PROCESS } from "../../constants";
import DeleteOrder from "./components/DeleteOrder";

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

const OrdersList = ({ dataSource, status, refetchOrders }) => {
  const searchInput = useRef(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteOrderOpen, setIsDeleteOrderOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(0);

  const [checkedRows, setCheckedRows] = useState([]);
  const navigate = useNavigate();

  const [activeOrder, setActiveOrder] = useState({
    orderId: null,
    orderStatus: null,
  });

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
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setIsOrderModalOpen(true);
              setActiveOrder({ orderId: id, orderStatus: status });
            }}
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
      render: (_, { user }) => {
        return <>{user}</>;
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
        return <>{payment?.payment_method?.replaceAll("_", " ")}</>;
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
            <EyeOutlined
              onClick={() => {
                setIsOrderModalOpen((prev) => !prev);
                setActiveOrder({ orderId: id, orderStatus: status });
              }}
            />

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

  const handleUpdateStatus = useMutation(
    (value) =>
      updateOrderStatus({ orderId: activeOrder.orderId, status: value }),
    {
      onSuccess: (data) => {
        setActiveOrder((prev) => ({ ...prev, orderStatus: data.status }));
        refetchOrders();
      },

      onError: (error) => {
        notification.open({
          className: "bg-red-500 text-white",
          message: (
            <div className="text-white">{error?.response?.data?.message}</div>
          ),
          description: error?.response?.data?.errors?.status
            ?.join(". ")
            ?.toString(),
        });
      },
    }
  );

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
          label: <div onClick={() => handleDeleteBulk.mutate()}>Delete</div>,
        },
      ]}
    />
  );

  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <Button
          className="flex items-center"
          type="primary"
          ghost
          onClick={() => {
            navigate("create-order");
          }}
        >
          Create New Order
        </Button>

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
        rowClassName="cursor-pointer"
        rowSelection={{ ...rowSelection }}
        onRow={(record) => {
          const { id, status } = record;
          return {
            onClick: () => {
              setIsOrderModalOpen((prev) => !prev);
              setActiveOrder({ orderId: id, orderStatus: status });
            },
          };
        }}
      />

      <OrderModal
        closeModal={() => setIsOrderModalOpen(false)}
        isOpen={isOrderModalOpen}
        orderId={activeOrder.orderId}
        orderedAt={
          dataSource?.find((order) => order.id === activeOrder.orderId)
            ?.created_at
        }
        refetchOrders={refetchOrders}
        title={
          <Space>
            <span>Order #{activeOrder.orderId}</span>
            <Select
              className="mx-5"
              disabled={handleUpdateStatus.status === "loading"}
              placeholder="Select Order Status"
              value={activeOrder.orderStatus}
              showSearch
              onChange={(value) => handleUpdateStatus.mutate(value)}
            >
              <Select.Option value={IN_PROCESS}>In Process</Select.Option>
              <Select.Option value={CANCELLED}>Cancelled</Select.Option>
              <Select.Option value={DELIVERED}>Delivered</Select.Option>
            </Select>
            {handleUpdateStatus.status === "loading" && <Spin size="small" />}
          </Space>
        }
        width={1200}
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
