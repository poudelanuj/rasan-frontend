import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Upload,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Breadcrumb,
} from "antd";
import { useCallback, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { getAllBrands } from "../../../api/brands";
import { getAllCategories } from "../../../api/categories";
import { getLoyaltyPolicies } from "../../../api/loyalties";
import { createProduct, getAllProducts } from "../../../api/products";
import {
  GET_ALL_BRANDS,
  GET_ALL_CATEGORIES,
} from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import CreateBrandModal from "../shared/CreateBrandModal";
import CreateCategoryModal from "../shared/CreateCategoryModal";

const AddProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateBrandOpen, setIsCreatBrandOpen] = useState(false);

  const { Dragger } = Upload;

  const navigate = useNavigate();

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

  const { data: categories, status: categoriesStatus } = useQuery({
    queryFn: () => getAllCategories(),
    queryKey: [GET_ALL_CATEGORIES],
  });

  const { data: brands, status: brandsStatus } = useQuery({
    queryFn: () => getAllBrands(),
    queryKey: [GET_ALL_BRANDS],
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
      if (selectedImage) formData.append("product_image", selectedImage);

      return createProduct(formData);
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

  const getHeaderBreadcrumb = useCallback(() => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/product-list">Products</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>Add New Product</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, []);

  return (
    <>
      <Loader isOpen={onFormSubmit.status === "loading"} />

      <CustomPageHeader
        breadcrumb={getHeaderBreadcrumb()}
        title="Add Product"
      />

      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
      />

      <CreateBrandModal
        isOpen={isCreateBrandOpen}
        onClose={() => setIsCreatBrandOpen(false)}
      />

      <>
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
                    className="h-[4rem] mx-auto"
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : "/gallery-icon.svg"
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

            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true, message: "product name required" }]}
            >
              <Input />
            </Form.Item>

            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label={
                  <Space>
                    <span>Product Category</span>
                    <Button
                      size="small"
                      onClick={() => setIsCreateCategoryOpen(true)}
                    >
                      Create New Category
                    </Button>
                  </Space>
                }
                name="category"
                rules={[{ required: true, message: "category required" }]}
              >
                <Select
                  loading={categoriesStatus === "loading"}
                  mode="multiple"
                  placeholder="Select Category"
                  allowClear
                >
                  {categories &&
                    categories.map((category) => (
                      <Select.Option key={category.slug} value={category.slug}>
                        {category.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <span>Product Brand</span>
                    <Button
                      size="small"
                      onClick={() => setIsCreatBrandOpen(true)}
                    >
                      Create New Brand
                    </Button>
                  </Space>
                }
                name="brand"
                rules={[{ required: true, message: "brand required" }]}
              >
                <Select
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

            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Alternate Products" name="alternate_products">
                <Select
                  loading={productsStatus === "loading"}
                  mode="multiple"
                  placeholder="Select Products"
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
                label="Supplement Products"
                name="supplementary_products"
              >
                <Select
                  loading={productsStatus === "loading"}
                  mode="multiple"
                  placeholder="Select Products"
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Loyalty Policy" name="loyalty_policy">
                <Select
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

              <Form.Item label="Is Vat Included?" name="includes_vat">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  className="flex"
                  defaultChecked={false}
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
      </>
    </>
  );
};

export default AddProduct;
