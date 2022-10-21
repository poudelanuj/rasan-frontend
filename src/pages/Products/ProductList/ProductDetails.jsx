import { Descriptions, Divider, Tag, Spin, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { capitalize } from "lodash";
import { parseSlug } from "../../../utils";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { publishProduct, unpublishProduct } from "../../../api/products";
import ProductSkuList from "./shared/ProductSkuList";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import rasanDefault from "../../../assets/images/rasan-default.png";

const ProductDetails = ({ slug, product, refetchProduct }) => {
  const handlePublish = useMutation(
    (bool) => (bool ? publishProduct(slug) : unpublishProduct(slug)),
    {
      onSuccess: (data) => openSuccessNotification(data.message),
      onError: (err) => openErrorNotification(err),
      onSettled: () => refetchProduct(),
    }
  );

  return (
    <div className="py-3">
      <div className="flex justify-start relative">
        <div className="w-[200px] h-[200px] rounded ">
          <img
            alt="product"
            className="w-[100%] h-[100%] rounded object-cover"
            src={product?.product_image?.full_size || rasanDefault}
          />
        </div>

        <div className="w-[50%] mx-8">
          <Descriptions column={1} title="">
            <Descriptions.Item label="Name">
              <span className="font-medium">{product.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <span className="font-medium">
                {Array.isArray(product.category)
                  ? product.category.map((item) => (
                      <span
                        key={item}
                        className="mr-2 cursor-pointer hover:underline"
                      >
                        {capitalize(parseSlug(item))}
                      </span>
                    ))
                  : capitalize(product.category)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Brand">
              <span className="font-medium">
                {Array.isArray(product.brand) ? (
                  product.brand.map((item) => (
                    <span
                      key={item}
                      className="mr-2 cursor-pointer hover:underline"
                    >
                      {capitalize(parseSlug(item))}
                    </span>
                  ))
                ) : (
                  <span className="mr-2 cursor-pointer hover:underline">
                    {capitalize(product.brand.replaceAll("-", " "))}
                  </span>
                )}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Published">
              <Tag color={product.is_published ? "green" : "orange"}>
                {product.is_published ? "Published" : "Not Published"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Product SKUs">
              <span className="font-medium">{product.product_skus?.count}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className="absolute top-0 right-0">
          <Space>
            <ButtonWPermission
              className="rounded"
              codename="change_product"
              disabled={handlePublish.status === "loading"}
              type={product.is_published ? "danger" : "primary"}
              onClick={() => handlePublish.mutate(!product.is_published)}
            >
              {handlePublish.status === "loading" ? (
                <Spin size="small" />
              ) : (
                <span>{product.is_published ? "Unpublish" : "Publish"}</span>
              )}
            </ButtonWPermission>
            <ButtonWPermission
              className="!text-[#00A0B0] !bg-inherit !border-none"
              codename="change_product"
            >
              <Link to={"edit"}>
                <EditOutlined style={{ verticalAlign: "middle" }} /> Edit
                Details
              </Link>
            </ButtonWPermission>
          </Space>
        </div>
      </div>

      <Divider />

      <div className="mt-[1rem]">
        <div className="mb-4">
          <h3 className="text-xl text-[#374253]">Product Details</h3>
        </div>

        <Descriptions column={2} size="middle" bordered>
          <Descriptions.Item label="S.No">
            <span className="font-medium">{product.sn}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Is Vat Included">
            <Tag color={product.includes_vat ? "green" : "orange"}>
              {product.includes_vat ? "Yes" : "No"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Published At">
            <span className="font-medium">
              {product.published_at
                ? moment(product.published_at).format("ll")
                : product.published_at}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Alternate Products" span={3}>
            <span className="font-medium">
              {product.alternate_products.map((item) => (
                <span
                  key={item}
                  className="mr-2 cursor-pointer hover:underline"
                >
                  {parseSlug(item)}
                </span>
              ))}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Supplement Products" span={3}>
            <span className="font-medium">
              {product.supplementary_products.map((item) => (
                <span
                  key={item}
                  className="mr-2 cursor-pointer hover:underline"
                >
                  {parseSlug(item)}
                </span>
              ))}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      <ProductSkuList
        productBrand={JSON.stringify(product.brand)}
        productCategory={JSON.stringify(product.category)}
        productSkus={product.product_skus?.results}
        productSlug={product.slug}
      />
    </div>
  );
};

export default ProductDetails;
