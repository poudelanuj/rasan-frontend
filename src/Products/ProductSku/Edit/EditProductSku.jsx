import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Upload, Form, Input, Select, Button, Space, Switch } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllBrands } from "../../../api/brands";
import { getAllCategories } from "../../../api/categories";
import { getLoyaltyPolicies } from "../../../api/loyalties";
import { getAllProductGroups } from "../../../api/productGroups";
import { getAllProducts } from "../../../api/products";
import { createProductSku, getProductSku } from "../../../api/productSku";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const EditProductSku = () => {
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
    queryKey: ["all-categories"],
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

      return createProductSku(formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Product Created");
        navigate(-1);
      },
      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <>
      <Loader isOpen={onFormSubmit.status === "loading"} />

      <div className="py-5">
        <CustomPageHeader title={`Edit ${productSku?.name}`} />

        {productSkuStatus === "success" && productSku && (
          <div>
            <Form
              layout="vertical"
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

              <div className="grid grid-cols-2 gap-2">
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[{ required: true, message: "product name required" }]}
                >
                  <Input defaultValue={productSku.name} />
                </Form.Item>

                <Form.Item
                  label="Product Name (In Nepali)"
                  name="name_np"
                  rules={[{ required: true, message: "product name required" }]}
                >
                  <Input defaultValue={productSku.name_np} />
                </Form.Item>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true, message: "quantity required" }]}
                >
                  <Input defaultValue={productSku.quantity} />
                </Form.Item>

                <Form.Item
                  label="Cost Price/Piece"
                  name="cost_price_per_piece"
                  rules={[
                    { required: true, message: "cost price/piece required" },
                  ]}
                >
                  <Input
                    defaultValue={productSku.cost_price_per_piece}
                    type="number"
                  />
                </Form.Item>

                <Form.Item
                  label="Price/Piece"
                  name="price_per_piece"
                  rules={[{ required: true, message: "price/piece required" }]}
                >
                  <Input defaultValue={productSku.price_per_piece} />
                </Form.Item>
                <Form.Item
                  label="MRP/Piece"
                  name="mrp_per_piece"
                  rules={[{ required: true, message: "MRP/piece required" }]}
                >
                  <Input
                    defaultValue={productSku.mrp_per_piece}
                    type="number"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Product SKU Description"
                name="description"
                rules={[{ required: true, message: "product name required" }]}
              >
                <Input.TextArea
                  defaultValue={productSku.description}
                  placeholder="Description"
                  rows={4}
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-2">
                <Form.Item
                  label="Product Category"
                  name="category"
                  rules={[{ required: true, message: "category required" }]}
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
                        <Select.Option key={category.sn} value={category.slug}>
                          {category.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Product Brand"
                  name="brand"
                  rules={[{ required: true, message: "brand required" }]}
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
                        <Select.Option key={brand.sn} value={brand.slug}>
                          {brand.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Form.Item
                  label="Product"
                  name="product"
                  rules={[{ required: true, message: "product required" }]}
                >
                  <Select
                    defaultValue={productSku.product}
                    loading={productsStatus === "loading"}
                    placeholder="Select Product"
                    allowClear
                  >
                    {products &&
                      products.map((product) => (
                        <Select.Option key={product.sn} value={product.slug}>
                          {product.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Product Group" name="product_group">
                  <Select
                    defaultValue={productSku.product_group}
                    loading={productGroupsStatus === "loading"}
                    mode="multiple"
                    placeholder="Select Product Group"
                    allowClear
                  >
                    {productGroups &&
                      productGroups.map((group) => (
                        <Select.Option key={group.sn} value={group.slug}>
                          {group.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item label="Loyalty Policy" name="loyalty_policy">
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

                <Form.Item label="Is Published?" name="includes_vat">
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    className="flex"
                    defaultChecked={productSku.includes_vat}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </div>

              <Form.Item>
                <Space className="w-full flex justify-end">
                  <Button htmlType="submit" size="large" type="primary">
                    Create
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
