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
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { getAllBrands } from "../../../api/brands";
import { getAllCategories } from "../../../api/categories";
import { getLoyaltyPolicies } from "../../../api/loyalties";
import {
  getAllProducts,
  getProduct,
  updateProduct,
  getPaginatedProducts,
} from "../../../api/products";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { useAuth } from "../../../AuthProvider";
import { GET_PRODUCT } from "../../../constants/queryKeys";

const EditProduct = () => {
  const { isMobileView } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);

  const { Dragger } = Upload;

  const navigate = useNavigate();
  const { slug } = useParams();

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

  const { data: product, status: productStatus } = useQuery({
    queryFn: () => getProduct(slug),
    queryKey: [GET_PRODUCT, slug],
    enabled: !!slug,
  });

  const { data: categories, status: categoriesStatus } = useQuery({
    queryFn: () => getAllCategories(),
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
        if (key === "includes_vat") {
          formData.append(key, formValues[key]);
        } else if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("product_image", selectedImage);

      return updateProduct(slug, formData);
    },
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Product Updated");
        queryClient.refetchQueries([GET_PRODUCT, slug]);
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
          <Link to="/product-list">Products</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>Edit Product</Breadcrumb.Item>
      </Breadcrumb>
    );
  }, []);

  return (
    <>
      <Loader
        isOpen={
          onFormSubmit.status === "loading" ||
          productStatus === "loading" ||
          !product ||
          !product?.name
        }
      />
      <CustomPageHeader
        breadcrumb={getHeaderBreadcrumb()}
        title={`Edit ${product?.name}`}
      />

      <div className="p-6 bg-white rounded-lg">
        {productStatus === "success" && product && product.name && (
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
                          : product.product_image?.thumbnail ||
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

              <Form.Item
                initialValue={product.name}
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Product name is required" },
                  {
                    validator: async (_, value) => {
                      const data = await getPaginatedProducts(
                        1,
                        1,
                        [],
                        value,
                        "",
                        "",
                        ""
                      );

                      if (product.name.toLowerCase() !== value.toLowerCase()) {
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
                <Input defaultValue={product.name} />
              </Form.Item>

              <div className="grid sm:grid-cols-2 gap-2">
                <Form.Item
                  initialValue={product.category}
                  label="Product Category"
                  name="category"
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select
                    defaultValue={product.category}
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
                  initialValue={product.brand}
                  label="Product Brand"
                  name="brand"
                  rules={[{ required: true, message: "Brand is required" }]}
                >
                  <Select
                    defaultValue={product.brand}
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
                  initialValue={product.alternate_products}
                  label="Alternate Products"
                  name="alternate_products"
                >
                  <Select
                    defaultValue={product.alternate_products}
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
                  initialValue={product.supplementary_products}
                  label="Supplement Products"
                  name="supplementary_products"
                >
                  <Select
                    defaultValue={product.supplementary_products}
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
                <Form.Item
                  initialValue={product.loyalty_policy}
                  label="Loyalty Policy"
                  name="loyalty_policy"
                >
                  <Select
                    defaultValue={product.loyalty_policy || []}
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

                <Form.Item
                  initialValue={product.includes_vat}
                  label="Is Vat Included?"
                  name="includes_vat"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    className="flex"
                    defaultChecked={product.includes_vat}
                    unCheckedChildren={<CloseOutlined />}
                  />
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

export default EditProduct;
