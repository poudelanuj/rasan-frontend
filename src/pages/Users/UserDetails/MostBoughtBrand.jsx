import { Table } from "antd";
import { useNavigate } from "react-router-dom";

export default function MostBoughtBrand({ brands }) {
  const navigate = useNavigate();

  const column = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
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
      dataSource={brands?.map((data) => ({
        ...data.brand,
        count: data.count,
        total_amount: data.total_amount,
      }))}
      rowClassName="cursor-pointer"
      onRow={(record) => {
        return {
          onClick: () => {
            navigate(`/brands/${record.slug}`);
          },
        };
      }}
    />
  );
}
