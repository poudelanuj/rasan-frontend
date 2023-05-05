import { useRef } from "react";
import { Modal, Button, Table } from "antd";
import { useQuery } from "react-query";
import { capitalize } from "lodash";
import { useReactToPrint } from "react-to-print";
import { getProduckSkuItems } from "../../../api/orders";

export default function ProductSKUModal({ isOpen, closeModal, ids, orders }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: productSkuItems, isLoading } = useQuery({
    queryFn: () => getProduckSkuItems({ ids }),
    queryKey: ["PRODUCT_SKU_ITEMS", ids],
  });

  const productSkuItemsColumn = [
    {
      key: "sn",
      title: "S.N.",
      dataIndex: "sn",
    },
    {
      key: "id",
      title: "SKU ID",
      dataIndex: "id",
    },
    {
      key: "name",
      title: "SKU Name",
      dataIndex: "name",
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "quantity",
    },
  ];

  const ordersColumn = [
    {
      key: "sn",
      title: "S.N.",
      dataIndex: "sn",
    },
    {
      key: "id",
      title: "Order ID",
      dataIndex: "id",
    },
    {
      title: "Customer",
      dataIndex: "phone",
      key: "phone",
      render: (_, { phone, customer_name }) => {
        return <>{customer_name ? `${customer_name} (${phone})` : phone}</>;
      },
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_paid_amount",
      key: "total_paid_amount",
      render: (_, { total_paid_amount }) => {
        return <>Rs. {total_paid_amount}</>;
      },
    },
    {
      title: "Shop Name",
      dataIndex: "shop_name",
      key: "shop_name",
      render: (_, { shop_name }) => (
        <span className="w-16" style={{ overflowWrap: "anywhere" }}>
          {capitalize(shop_name?.replaceAll("_", " "))}
        </span>
      ),
    },
  ];

  return (
    <Modal
      footer={
        <Button
          type="primary"
          onClick={() => {
            printRef.current.style.padding = "50px";
            handlePrint();
            printRef.current.style.padding = "0";
          }}
        >
          Download
        </Button>
      }
      title="Product SKU"
      visible={isOpen}
      width="50vw"
      onCancel={closeModal}
    >
      <div ref={printRef} className="flex flex-col gap-8">
        <div className="flex flex-col">
          <p className="text-lg">Product SKU Details</p>
          <Table
            columns={productSkuItemsColumn}
            dataSource={productSkuItems?.results?.map((data, index) => ({
              sn: index + 1,
              ...data,
              ...data?.product_sku,
            }))}
            loading={isLoading}
            pagination={false}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-lg">Order Details</p>
          <Table
            columns={ordersColumn}
            dataSource={orders?.map((data, index) => ({
              sn: index + 1,
              ...data,
            }))}
            loading={isLoading}
            pagination={false}
          />
        </div>
      </div>
    </Modal>
  );
}
