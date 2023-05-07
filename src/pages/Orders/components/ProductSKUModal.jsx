import { useRef } from "react";
import { Modal, Button, Table } from "antd";
import { useQuery } from "react-query";
import { capitalize } from "lodash";
import { getProduckSkuItems } from "../../../api/orders";

import { savePDF } from "@progress/kendo-react-pdf";

class DocService {
  createPdf = (html) => {
    savePDF(html, {
      paperSize: "Letter",
      fileName: "donwload.pdf",
      margin: 40,
    });
  };
}

const Doc = new DocService();

const createPdf = (html) => Doc.createPdf(html);

export default function ProductSKUModal({ isOpen, closeModal, ids, orders }) {
  const printRef = useRef();

  const handleDownloadPdf = () => createPdf(printRef.current);

  const { data: productSkuItems, isLoading } = useQuery({
    queryFn: () => getProduckSkuItems({ ids }),
    queryKey: ["PRODUCT_SKU_ITEMS", ids],
  });

  const productSkuItemsColumn = [
    {
      key: "sn",
      title: "S.N.",
      dataIndex: "sn",
      width: "8%",
    },
    {
      key: "name",
      title: "SKU Name",
      dataIndex: "name",
      width: "50%",
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "quantity",
      width: "15%",
    },
  ];

  const ordersColumn = [
    {
      key: "sn",
      title: "S.N.",
      dataIndex: "sn",
      width: "8%",
    },
    {
      title: "Customer",
      dataIndex: "phone",
      key: "phone",
      render: (_, { phone, customer_name }) => {
        return <>{customer_name ? `${customer_name} (${phone})` : phone}</>;
      },
      width: "50%",
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
        <Button type="primary" onClick={handleDownloadPdf}>
          Download
        </Button>
      }
      title="Product SKU"
      visible={isOpen}
      width="50vw"
      onCancel={closeModal}
    >
      <div ref={printRef} className="flex flex-col gap-8 px-[15px]" id="pdf">
        <div className="flex flex-col">
          <p>Product SKU Details</p>
          <Table
            columns={productSkuItemsColumn}
            dataSource={productSkuItems?.results?.map((data, index) => ({
              sn: index + 1,
              ...data,
              ...data?.product_sku,
            }))}
            loading={isLoading}
            pagination={false}
            size="small"
          />
        </div>

        <div className="flex flex-col">
          <p>Order Details</p>
          <Table
            columns={ordersColumn}
            dataSource={orders?.map((data, index) => ({
              sn: index + 1,
              ...data,
            }))}
            loading={isLoading}
            pagination={false}
            size="small"
          />
        </div>

        <p className="text-right">
          Total Amount: Rs.{" "}
          {orders
            ?.map((data) => data.total_paid_amount)
            ?.reduce((current, next) => Number(current) + Number(next), 0)}
        </p>
      </div>
    </Modal>
  );
}
