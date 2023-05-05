import { useState, useContext } from "react";
import { Table, Tag, Button, Menu, Dropdown, Space, Input, Select } from "antd";
import { useMutation } from "react-query";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaRegFileArchive } from "react-icons/fa";
import getOrderStatusColor from "../../shared/tagColor";
import DeleteOrder from "./components/DeleteOrder";
import ProductSKUModal from "./components/ProductSKUModal";
import ButtonWPermission from "../../shared/ButtonWPermission";
import { isEmpty, capitalize } from "lodash";
import { DELIVERY_STATUS, IN_PROCESS } from "../../constants";
import { archiveBulkOrders } from "../../api/orders";
import { updateOrderStatus } from "../../api/orders";
import { OrderContext } from ".";
import { useAuth } from "../../AuthProvider";
import { openErrorNotification, openSuccessNotification } from "../../utils";

const OrdersList = () => {
  const {
    dataSource,
    status,
    refetchOrders,
    page,
    setPage,
    pageSize,
    setPageSize,
    ordersCount,
    sortObj,
    setSortObj,
    searchInput,
    addressRoutes,
    setAddressRoute,
  } = useContext(OrderContext);

  const { isMobileView } = useAuth();

  let timeout = 0;

  const [isArchiveOrder, setIsArchiveOrder] = useState({
    isOpen: false,
    id: null,
  });

  const [isBulkArchiveOrderOpen, setIsBulkArchiveOrderOpen] = useState(false);

  const [checkedRows, setCheckedRows] = useState([]);

  const [productSkuPopup, setProductSkuPopup] = useState(false);

  const [selectedOrders, setSelectedOrders] = useState([]);

  const navigate = useNavigate();

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
      width: "25%",
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
        return <>{moment(created_at).format("lll")}</>;
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
      render: (_, { id }) => {
        return (
          <>
            <ButtonWPermission
              className="!border-none !bg-inherit"
              codename="delete_order"
              icon={<FaRegFileArchive />}
              onClick={() => setIsArchiveOrder({ isOpen: true, id })}
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
      setSelectedOrders(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  const handleArchiveOrder = useMutation(
    (id) =>
      updateOrderStatus({
        orderId: id,
        status: "archived",
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchOrders();
        setIsArchiveOrder({ isOpen: false, id: null });
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const handleArchiveBulkOrders = useMutation((ids) => archiveBulkOrders(ids), {
    onSuccess: (res) => {
      openSuccessNotification(res.message);
      refetchOrders();
      setCheckedRows([]);
      setIsBulkArchiveOrderOpen(false);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handleUpdateOrderStatus = useMutation(
    ({ ids, action_type }) => updateOrderStatus({ ids, action_type }),
    {
      onSuccess: (res) => {
        openSuccessNotification(res.message);
        refetchOrders();
        setCheckedRows([]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const orderStatusMenu = DELIVERY_STATUS.map(({ id, name }) => ({
    key: id,
    label:
      id === "archived" ? (
        <ButtonWPermission
          className="!border-none !bg-inherit !text-current"
          codename="delete_order"
          disabled={isEmpty(checkedRows)}
          onClick={() => setIsBulkArchiveOrderOpen(true)}
        >
          Archive
        </ButtonWPermission>
      ) : (
        <Button
          className="!border-none !bg-inherit !text-current"
          disabled={isEmpty(checkedRows)}
          onClick={() =>
            handleUpdateOrderStatus.mutate({
              ids: checkedRows,
              action_type: id,
            })
          }
        >
          {name}
        </Button>
      ),
  }));

  const bulkMenu = <Menu items={orderStatusMenu} />;

  return (
    <div className="hidden sm:block">
      <div className="mb-2 flex gap-2 justify-between sm:flex-row flex-col">
        <div className="flex gap-2">
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

          <Input
            className="!w-80"
            placeholder="Search user, contact, shop"
            onChange={(e) => {
              searchInput.current = e.target.value;
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(() => {
                setPage(1);
                refetchOrders();
              }, 400);
            }}
          />

          <Select
            className="!w-72"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            mode="multiple"
            optionFilterProp="children"
            options={addressRoutes?.results?.map((area) => ({
              value: area.id,
              label: area.name,
            }))}
            placeholder="Search with route"
            style={{ width: 200 }}
            showSearch
            onChange={(val) => setAddressRoute(val)}
          />
        </div>

        <Space className="justify-end">
          {!isEmpty(checkedRows) && (
            <Button
              className="bg-cyan-500 text-white"
              type="default"
              onClick={() => setProductSkuPopup(true)}
            >
              Export Product SKU
            </Button>
          )}

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

      {!isEmpty(checkedRows) && (
        <ProductSKUModal
          closeModal={() => setProductSkuPopup(false)}
          ids={checkedRows}
          isOpen={productSkuPopup}
          orders={selectedOrders}
        />
      )}

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
        scroll={{ x: isEmpty(dataSource) && !isMobileView ? null : 1000 }}
        showSorterTooltip={false}
        size="small"
      />

      <DeleteOrder
        closeModal={() => setIsArchiveOrder({ isOpen: false, id: null })}
        deleteMutation={() => handleArchiveOrder.mutate(isArchiveOrder.id)}
        isOpen={isArchiveOrder.isOpen}
        status={handleArchiveOrder.status}
        title={"Order #" + isArchiveOrder.id}
      />

      <DeleteOrder
        closeModal={() => setIsBulkArchiveOrderOpen(false)}
        deleteMutation={() => handleArchiveBulkOrders.mutate(checkedRows)}
        isOpen={isBulkArchiveOrderOpen}
        status={handleArchiveBulkOrders.status}
        title="Archive Selected Order?"
      />
    </div>
  );
};

export default OrdersList;
