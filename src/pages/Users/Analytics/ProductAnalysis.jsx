import { useState } from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { CustomCard } from "../../../components/customCard";
import { getProductAnalytics } from "../../../api/analytics";
import { GET_PRODUCT_ANALYTICS } from "../../../constants/queryKeys";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import { AnalysisTimeSelector } from "../../../components/analysisTimeSelector";

export const ProductAnalysis = ({ user }) => {
  const navigate = useNavigate();

  const [date, setDate] = useState("this_month");

  const { data: productAnalytics } = useQuery({
    queryFn: () => getProductAnalytics({ user_id: user.id, date }),
    queryKey: [GET_PRODUCT_ANALYTICS, { user_id: user.id, date }],
  });

  const data = productAnalytics?.map((product) => ({
    id: product.product.id,
    product_name: product.product.name,
    slug: product.product.slug,
    quantity: product.count,
    price: product.total_amount,
    product_image: product.product.image.thumbnail,
  }));

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
      render: (text, { slug }) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`/product-list/${slug}`)}
        >
          {text}
        </span>
      ),
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

  return (
    <CustomCard className="col-span-2">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg mb-0">Products</h2>
        <AnalysisTimeSelector onChange={setDate} />
      </div>
      {productAnalytics && <Table columns={columns} dataSource={data} />}
    </CustomCard>
  );
};
