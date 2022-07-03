import { useNavigate } from "react-router-dom";

import { Button, Table, Tag } from "antd";

const columns = [
  {
    title: "S.No",
    dataIndex: "index",
    defaultSortOrder: "ascend",
    render: (text) => <>#{text}</>,
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Product Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    render: (_, { product_sku_image, name }) => (
      <div className="flex items-center gap-3">
        <img
          alt=""
          className="h-[40px] w-[40px] object-cover rounded"
          src={product_sku_image?.thumbnail || "/rasan-default.png"}
        />
        <span>{name}</span>
      </div>
    ),
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "CP Per Piece",
    dataIndex: "cost_price_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "MRP Per Piece",
    dataIndex: "mrp_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },
  {
    title: "SP Per Piece",
    dataIndex: "price_per_piece",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.address.length - b.address.length,
  },

  {
    title: "Status",
    render: (text, record) => {
      return (
        <Tag color={record.is_published ? "green" : "orange"}>
          {record.is_published ? "Published" : "Unpublished"}
        </Tag>
      );
    },
  },
];

function ProductSkuList({ productSkus, productSlug }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4 flex justify-between">
        <h3 className="text-xl text-[#374253]">Product SKU List</h3>
        <Button
          type="primary"
          onClick={() => navigate(`/product-sku/add?product=${productSlug}`)}
        >
          Create New Product SKU
        </Button>
      </div>
      <div className="flex flex-col bg-white ">
        <div className="flex-1">
          <Table
            columns={columns}
            dataSource={productSkus?.map((item, index) => ({
              ...item,
              key: item.id || item.slug,
              index: index + 1,
            }))}
            rowClassName="cursor-pointer"
            onRow={(record) => {
              return {
                onClick: () => {
                  const pageHeaderPath = `/product-list/${productSlug}`;
                  navigate(
                    `/product-sku/${record.slug}?path=${pageHeaderPath}`
                  );
                },
              };
            }}
          />
        </div>
      </div>
    </>
  );
}

export default ProductSkuList;
