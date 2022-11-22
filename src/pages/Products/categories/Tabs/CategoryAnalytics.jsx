import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { CustomCard } from "../../../../components/customCard";
import { Table } from "antd";
import { AnalysisTimeSelector } from "../../../../components/analysisTimeSelector";
import { getProductSkuAnalytics } from "../../../../api/analytics";
import { GET_PRODUCTSKU_ANALYTICS } from "../../../../constants/queryKeys";
import { DEFAULT_RASAN_IMAGE } from "../../../../constants";

export const CategoryAnalytics = ({ category_id }) => {
  const navigate = useNavigate();

  const [date, setDate] = useState("this_month");

  const { data: productSkuAnalytics } = useQuery({
    queryFn: () => getProductSkuAnalytics({ category_id, date }),
    queryKey: [GET_PRODUCTSKU_ANALYTICS, { category_id, date }],
  });

  const data = productSkuAnalytics?.map((product) => ({
    id: product.product_sku.id,
    product_name: product.product_sku.name,
    slug: product.product_sku.slug,
    quantity: product.count,
    price: product.total_amount,
    product_image: product.product_sku.image.thumbnail,
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
          onClick={() => navigate(`/product-sku/${slug}`)}
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
      <div className="flex items-center justify-between">
        <p className="text-xl mb-0 text-text">Category Analytics</p>
        <AnalysisTimeSelector onChange={setDate} />
      </div>
      <div className="bg-white rounded-md border border-solid border-gray-100 p-3.5 mt-7">
        {CategoryAnalytics && <Table columns={columns} dataSource={data} />}
      </div>
    </CustomCard>
  );
};
