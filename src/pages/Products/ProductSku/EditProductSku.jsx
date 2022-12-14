import { Upload, Form, Input, Select, Button, Space, Breadcrumb } from "antd";
import ReactQuill from "react-quill";
import { useCallback, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { getAllBrands } from "../../../api/brands";
import { getAllCategories } from "../../../api/categories";
import { getLoyaltyPolicies } from "../../../api/loyalties";
import { getAllProductGroups } from "../../../api/products/productGroups";
import { getAllProducts } from "../../../api/products";
import {
  getProductSku,
  updateProductSku,
  getPaginatedProdctSkus,
} from "../../../api/products/productSku";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { useAuth } from "../../../AuthProvider";

const EditProductSku = () => {
  const { isMobileView } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);

  const { Dragger } = Upload;

  const navigate = useNavigate();
  const { slug } = useParams();

  const fileUploadOptions = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      if (file) setSelectedImage(file);
      return false;
    },
    onRemove: () => setSelectedImage(null),
  };

  const { data: productSku, status: productSkuStatus } = useQuery({
    queryFn: () => getProductSku(slug),
    queryKey: ["get-product-sku", slug],
    enabled: !!slug,
  });

  const { data: categories, status: categoriesStatus } = useQuery({
    queryFn: () => getAllCategories(),
    queryKey: ["all-categories"],
  });

  const { data: productGroups, status: productGroupsStatus } = useQuery({
    queryFn: () => getAllProductGroups(),
    queryKey: ["all-product-groups"],
  });

  const { data: brands, status: brandsStatus } = useQuery({
    queryFn: () => getAllBrands(),
    queryKey: ["all-brands"],
  });

  const { data: products, status: productsStatus } = useQuery({
    queryFn: () => getAllProducts(),
    queryKey: ["all-products"],
  });

  const { data: loyalties, status: loyaltiesStatus } = useQuery({
    queryFn: () => getLoyaltyPolicies(),
    queryKey: ["loyalties"],
  });

  const onFormSubmit = useMutation(
    (formValues) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array
        if (Array.isArray(formValues[key])) {
          formValues[key].forEach((value) => {
            if (value) formData.append(key, value);
          });
          return;
        }
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("product_sku_image", selectedImage);

      return updateProductSku(slug, formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Product Created");
        navigate(`../${data.data.slug}`);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-sku">Product SKUs</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>Edit Product SKU</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, []);

  return (
    <>
      <Loader
        isOpen={
          onFormSubmit.status === "loading" || productSkuStatus === "loading"
        }
      />
      <CustomPageHeader
        breadcrumb={getHeaderBreadcrumb()}
        title={`Edit ${productSku?.name}`}
      />

      <div className="p-6 bg-white rounded-lg">
        {productSkuStatus === "success" && productSku && (
          <div>
            <Form
              layout={isMobileView ? "horizontal" : "vertical"}
              onFinish={(values) => onFormSubmit.mutate(values)}
            >
              <Form.Item label="Product Image">
                <Dragger {...fileUploadOptions}>
                  <p className="ant-upload-drag-icon">
                    <img
                      alt="gallery"
                      className="h-[10rem] mx-auto"
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : productSku?.product_sku_image?.thumbnail ||
                            "/gallery-icon.svg"
                      }
                    />
                  </p>
                  <p className="ant-upload-text ">
                    <span className="text-gray-500">
                      click or drag file to this area to upload
                    </span>
                  </p>
                </Dragger>
              </Form.Item>

              <div className="grid sm:grid-cols-2 gap-2">
                <Form.Item
                  initialValue={productSku.name}
                  label="Product Name"
                  name="name"
                  rules={[
                    { required: true, message: "Product name is required" },
                    {
                      validator: async (_, value) => {
                        const data = await getPaginatedProdctSkus(
                          1,
                          1,
                          [],
                          value,
                          ""
                        );
                        if (
                          productSku.name.toLowerCase() !== value.toLowerCase()
                        ) {
                          if (
                            !isEmpty(
                              data.results?.find(
                                (product) =>
                                  product.name.toLowerCase() ===
                                  value.toLowerCase()
                              )
                            )
                          )
                            return Promise.reject(`${value} already exist`);
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input defaultValue={productSku.name} />
                </Form.Item>

                <Form.Item
                  initialValue={productSku.name_np}
                  label="Product Name (In Nepali)"
                  name="name_np"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input defaultValue={productSku.name_np} />
                </Form.Item>
              </div>

              <div className="grid sm:grid-cols-4 grid-cols-2 gap-2">
                <Form.Item
                  initialValue={productSku.quantity}
                  label="Weight/Volume"
                  name="quantity"
                  rules={[{ required: true, message: "Quantity is required" }]}
                >
                  <Input defaultValue={productSku.quantity} />
                </Form.Item>

                <Form.Item
                  initialValue={productSku.cost_price_per_piece}
                  label="Cost Price/Piece"
                  name="cost_price_per_piece"
                  rules={[
                    { required: true, message: "Cost price/piece is required" },
                  ]}
                >
                  <Input
                    defaultValue={productSku.cost_price_per_piece}
                    type="number"
                  />
                </Form.Item>

                <Form.Item
                  initialValue={productSku.price_per_piece}
                  label="Price/Piece"
                  name="price_per_piece"
                  rules={[
                    { required: true, message: "Price/piece us required" },
                  ]}
                >
                  <Input defaultValue={productSku.price_per_piece} />
                </Form.Item>
                <Form.Item
                  initialValue={productSku.mrp_per_piece}
                  label="MRP/Piece"
                  name="mrp_per_piece"
                  rules={[{ required: true, message: "MRP/piece is required" }]}
                >
                  <Input
                    defaultValue={productSku.mrp_per_piece}
                    type="number"
                  />
                </Form.Item>
              </div>

              <Form.Item
                initialValue={productSku.description}
                label="Product SKU Description"
                name="description"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <ReactQuill theme="snow" />
              </Form.Item>

              <div className="grid sm:grid-cols-2 gap-2">
                <Form.Item
                  initialValue={productSku.category}
                  label="Product Category"
                  name="category"
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select
                    defaultValue={productSku.category}
                    loading={categoriesStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Category"
                    allowClear
                  >
                    {categories &&
                      categories.map((category) => (
                        <Select.Option
                          key={category.slug}
                          value={category.slug}
                        >
                          {category.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  initialValue={productSku.brand}
                  label="Product Brand"
                  name="brand"
                  rules={[{ required: true, message: "Brand is required" }]}
                >
                  <Select
                    defaultValue={productSku.brand}
                    loading={brandsStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Brand"
                    allowClear
                  >
                    {brands &&
                      brands.map((brand) => (
                        <Select.Option key={brand.slug} value={brand.slug}>
                          {brand.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                <Form.Item
                  initialValue={productSku.product}
                  label="Product"
                  name="product"
                  rules={[{ required: true, message: "Product is required" }]}
                >
                  <Select
                    defaultValue={productSku.product}
                    loading={productsStatus === "loading"}
                    placeholder="Select Product"
                    allowClear
                  >
                    {products &&
                      products.map((product) => (
                        <Select.Option key={product.slug} value={product.slug}>
                          {product.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  initialValue={productSku.product_group}
                  label="Rasan Choice"
                  name="product_group"
                >
                  <Select
                    defaultValue={productSku.product_group}
                    loading={productGroupsStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Rasan Choice"
                    allowClear
                  >
                    {productGroups &&
                      productGroups.map((group) => (
                        <Select.Option key={group.slug} value={group.slug}>
                          {group.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  initialValue={productSku.loyalty_policy}
                  label="Loyalty Policy"
                  name="loyalty_policy"
                >
                  <Select
                    defaultValue={productSku.loyalty_policy}
                    loading={loyaltiesStatus === "loading"}
                    placeholder="Select Loyalty Policy"
                    allowClear
                  >
                    {loyalties &&
                      loyalties.map((loyalty) => (
                        <Select.Option key={loyalty.id} value={loyalty.id}>
                          {loyalty.remarks}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item>
                <Space className="w-full flex justify-end">
                  <Button htmlType="submit" size="large" type="primary">
                    Update
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProductSku;
