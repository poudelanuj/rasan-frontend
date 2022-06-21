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
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRef } from "react";
import { useState } from "react";
import OrderModal from "./components/OrderModal";
import CreateOrder from "./components/CreateOrder";
import { updateOrderStatus } from "../context/OrdersContext";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: <>Delete</>,
      },
      {
        key: "2",
        label: <>Example</>,
      },
    ]}
  />
);

const OrdersList = ({ dataSource, status }) => {
  const searchInput = useRef(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const [activeOrder, setActiveOrder] = useState({
    orderId: null,
    orderStatus: null,
  });

  const getTagColor = (status) => {
    switch (status) {
      case "in progress":
        return "orange";
      case "cancelled":
        return "red";
      case "delivered":
        return "green";
      default:
        return "green";
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

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
      render: (_, { id }) => {
        return <div className="text-blue-500">#{id}</div>;
      },
      ...getColumnSearchProps("order Id"),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      ...getColumnSearchProps("customer"),
      sorter: (a, b) => a.customer.localeCompare(b.customer),
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
            <Tag color={getTagColor(status)}>{status.toUpperCase()}</Tag>
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
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (_, { deliveryDate }) => {
        return <>{moment(deliveryDate).format("ll")}</>;
      },
      sorter: (a, b) => a.deliveryDate - b.deliveryDate,
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

  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <Button
          className="flex items-center"
          type="primary"
          ghost
          onClick={() => {
            setIsCreateOrderOpen((prev) => !prev);
          }}
        >
          Create New Order
        </Button>

        <div>
          <Dropdown overlay={menu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>

          <Button className="ml-4 bg-cyan-500 text-white" type="default">
            <Space>Export</Space>
          </Button>
        </div>
      </div>

      {status === "loading" && (
        <div className="w-full py-10 bg-white flex justify-center">
          <Spin />
        </div>
      )}

      {status === "success" && (
        <Table
          columns={columns}
          dataSource={dataSource}
          rowSelection={{ ...rowSelection }}
        />
      )}

      <OrderModal
        closeModal={() => setIsOrderModalOpen(false)}
        isOpen={isOrderModalOpen}
        orderId={activeOrder.orderId}
        title={
          <>
            Order #{activeOrder.orderId}
            <Select
              className="mx-5"
              disabled={handleUpdateStatus.status === "loading"}
              placeholder="Select Order Status"
              value={activeOrder.orderStatus}
              showSearch
              onChange={(value) => handleUpdateStatus.mutate(value)}
            >
              <Select.Option value="in_process">In Process</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
            </Select>
            {handleUpdateStatus.status === "loading" && <Spin size="small" />}
          </>
        }
        width={1000}
      />

      <CreateOrder
        closeModal={() => setIsCreateOrderOpen(false)}
        isOpen={isCreateOrderOpen}
        title="Create Order"
      />
    </div>
  );
};

export default OrdersList;
