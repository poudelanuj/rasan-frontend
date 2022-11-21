import { useState } from "react";
import { Select, Table } from "antd";
import { useQuery } from "react-query";
import { CustomCard } from "../../../components/customCard";
import { getProductAnalytics } from "../../../api/analytics";
import { GET_PRODUCT_ANALYTICS } from "../../../constants/queryKeys";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";

const { Option } = Select;

const columns = [
  {
    title: "Product Image",
    dataIndex: "product_image",
    render: (_, { product_image }) => (
      <img
        alt="rasan"
        className="w-11"
        src={product_image || DEFAULT_RASAN_IMAGE}
      />
    ),
  },
  {
    title: "Product Name",
    dataIndex: "product_name",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
];

export const ProductAnalysis = ({ user }) => {
  const [date, setDate] = useState("this_month");

  const { data: productAnalytics } = useQuery({
    queryFn: () => getProductAnalytics({ user_id: user.id, date }),
    queryKey: [GET_PRODUCT_ANALYTICS, { user_id: user.id, date }],
  });

  const data = productAnalytics?.map((product) => ({
    id: product.product.id,
    product_name: product.product.name,
    quantity: product.count,
    price: product.total_amount,
    product_image: product.product.image.thumbnail,
  }));

  return (
    <CustomCard className="col-span-2">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Products</h2>
        <Select
          defaultValue="this_month"
          style={{ width: 120 }}
          onChange={(val) => setDate(val)}
        >
          <Option value="today">Today</Option>
          <Option value="this_month">This Month</Option>
          <Option value="last_year">Last Year</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={data} />
    </CustomCard>
  );
};
