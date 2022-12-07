import { Upload, Form, Input, Select, Button, Space, Breadcrumb } from "antd";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getAllBrands } from "../../../api/brands";
import { getAllCategories } from "../../../api/categories";
import { getLoyaltyPolicies } from "../../../api/loyalties";
import { getAllProductGroups } from "../../../api/products/productGroups";
import { getAllProducts } from "../../../api/products";
import {
  createProductSku,
  getPaginatedProdctSkus,
} from "../../../api/products/productSku";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import {
  GET_ALL_BRANDS,
  GET_ALL_CATEGORIES,
  GET_ALL_LOYALTIES,
  GET_ALL_PRODUCTS,
  GET_ALL_PRODUCT_GROUPS,
  GET_PAGINATED_PRODUCT_SKUS,
  GET_PRODUCT_SKU,
} from "../../../constants/queryKeys";
import CreateCategoryModal from "../shared/CreateCategoryModal";
import CreateBrandModal from "../shared/CreateBrandModal";
import { useAuth } from "../../../AuthProvider";
import { isEmpty } from "lodash";

const AddProductSku = () => {
  const { isMobileView } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateBrandOpen, setIsCreatBrandOpen] = useState(false);

  const { Dragger } = Upload;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

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

  const { data: productGroups, status: productGroupsStatus } = useQuery({
    queryFn: () => getAllProductGroups(),
    queryKey: [GET_ALL_PRODUCT_GROUPS],
  });

  const { data: brands, status: brandsStatus } = useQuery({
    queryFn: () => getAllBrands(),
    queryKey: [GET_ALL_BRANDS],
  });

  const { data: products, status: productsStatus } = useQuery({
    queryFn: () => getAllProducts(),
    queryKey: [GET_ALL_PRODUCTS],
  });

  const { data: loyalties, status: loyaltiesStatus } = useQuery({
    queryFn: () => getLoyaltyPolicies(),
    queryKey: [GET_ALL_LOYALTIES],
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
        queryClient.refetchQueries([GET_PRODUCT_SKU]);
        queryClient.refetchQueries([GET_PAGINATED_PRODUCT_SKUS]);
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
          <Link to="/product-sku">Product SKUs</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>Add New Product SKU</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, []);

  return (
    <>
      <Loader isOpen={onFormSubmit.status === "loading"} />

      <CustomPageHeader
        breadcrumb={getHeaderBreadcrumb()}
        title="Add Product SKU"
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
        <div className="p-6 bg-white rounded-lg">
          <Form
            layout={isMobileView ? "horizontal" : "vertical"}
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

            <div className="grid sm:grid-cols-2 gap-2">
              <Form.Item
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
                        !isEmpty(
                          data.results?.find(
                            (product) =>
                              product.name.toLowerCase() === value.toLowerCase()
                          )
                        )
                      )
                        return Promise.reject(`${value} already exist`);

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Product Name (In Nepali)"
                name="name_np"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="grid sm:grid-cols-4 grid-cols-2 gap-2">
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Quantity is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Cost Price/Piece"
                name="cost_price_per_piece"
                rules={[
                  { required: true, message: "Cost price/piece is required" },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject("Negative values not allowed")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Price/Piece"
                name="price_per_piece"
                rules={[
                  { required: true, message: "Price/piece is required" },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject("Negative values not allowed")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="MRP/Piece"
                name="mrp_per_piece"
                rules={[
                  { required: true, message: "MRP/piece is required" },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject("Negative values not allowed")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </div>

            <Form.Item
              label="Product SKU Description"
              name="description"
              rules={[
                { required: true, message: "Product description is required" },
              ]}
            >
              <ReactQuill theme="snow" />
            </Form.Item>

            <div className="grid sm:grid-cols-2 gap-2">
              <Form.Item
                initialValue={JSON.parse(searchParams.get("category") || "[]")}
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
                rules={[{ required: true, message: "Category is required" }]}
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
                initialValue={JSON.parse(searchParams.get("brand") || "[]")}
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
                rules={[{ required: true, message: "Brand is required" }]}
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

            <div className="grid sm:grid-cols-2 gap-2">
              <Form.Item
                initialValue={searchParams.get("product")}
                label={
                  <Space>
                    <span>Product</span>

                    <Button
                      size="small"
                      onClick={() => navigate("/product-list/add")}
                    >
                      Create New Product
                    </Button>
                  </Space>
                }
                name="product"
                rules={[{ required: true, message: "Product is required" }]}
              >
                <Select
                  defaultValue={searchParams.get("product")}
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

              <Form.Item label="Rasan Choice" name="product_group">
                <Select
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

export default AddProductSku;
