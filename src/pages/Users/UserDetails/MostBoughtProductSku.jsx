import { Image, Table } from "antd";
import { useNavigate } from "react-router-dom";

export default function MostBoughtProductSku({ products }) {
  const navigate = useNavigate();

  const column = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "image",
      dataIndex: "image",
      title: "Image",
      render: (text) => (
        <Image
          alt="product_image"
          className="!w-24 !h-20"
          src={text}
          onClick={(event) => event.preventDefault()}
        />
      ),
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
    },
    {
      key: "name_np",
      dataIndex: "name_np",
      title: "Name (Nepali)",
    },
    {
      key: "count",
      dataIndex: "count",
      title: "Count",
    },
    {
      key: "total_amount",
      dataIndex: "total_amount",
      title: "Total Amount",
    },
  ];

  return (
    <Table
      columns={column}
      dataSource={products?.map((data) => ({
        ...data.product_sku,
        image: data.product_sku.image.full_size,
        count: data.count,
        total_amount: data.total_amount,
      }))}
      rowClassName="cursor-pointer"
      onRow={(record) => {
        return {
          onClick: () => {
            navigate(`/product-sku/${record.slug}?search=`);
          },
        };
      }}
    />
  );
}
