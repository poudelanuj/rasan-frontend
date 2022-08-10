import { Form, Select, Input, Button } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomPageHeader from "../../../shared/PageHeader";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import { postPromotions } from "../../../api/promotions";
import { getAllBrands } from "../../../api/brands";
import {
  GET_ALL_BRANDS,
  GET_ALL_CATEGORIES,
  GET_ALL_PRODUCT_GROUPS,
  GET_PROMOTIONS,
  GET_USER_GROUPS,
} from "../../../constants/queryKeys";
import { getAllCategories } from "../../../api/categories";
import { getAllProductGroups } from "../../../api/products/productGroups";
import { getUserGroups } from "../../../api/userGroups";

const CreatePromotionsPage = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { Option } = Select;

  const { TextArea } = Input;

  const [type, setType] = useState("");

  const handlePostPromotions = useMutation((data) => postPromotions(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      queryClient.refetchQueries([GET_PROMOTIONS]);
      form.resetFields();
      navigate(-1);
    },
    onError: (err) => openErrorNotification(err),
  });

  const { data: brands } = useQuery({
    queryFn: () => getAllBrands(),
    queryKey: GET_ALL_BRANDS,
  });

  const { data: category } = useQuery({
    queryFn: () => getAllCategories(),
    queryKey: GET_ALL_CATEGORIES,
  });

  const { data: productGroup } = useQuery({
    queryFn: () => getAllProductGroups(),
    queryKey: GET_ALL_PRODUCT_GROUPS,
  });

  const { data: userGroups } = useQuery({
    queryFn: () => getUserGroups(),
    queryKey: GET_USER_GROUPS,
  });

  return (
    <div className="px-4 bg-[#FFFFFF]">
      <CustomPageHeader title="Create Promotion" />

      <Form
        autoComplete="off"
        className="w-full grid grid-cols-2 gap-x-8"
        form={form}
        initialValues={{ remember: true }}
        layout="vertical"
        name="basic"
        onFinish={() =>
          form
            .validateFields()
            .then((values) => handlePostPromotions.mutate(values))
        }
      >
        <Form.Item
          className="col-span-full"
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input placeholder="Enter a title" />
        </Form.Item>

        <Form.Item
          className="col-span-full"
          label="Detail"
          name="detail"
          rules={[{ required: true, message: "Please input detail!" }]}
        >
          <TextArea placeholder="Enter detail" allowClear autoSize />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select an option"
            allowClear
            onChange={(value) => setType(value)}
          >
            <Option value="brand">Brand</Option>
            <Option value="category">Category</Option>
            <Option value="product_group">Product Group</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Context"
          name={type}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select user groups" allowClear>
            {type === "brand" &&
              brands &&
              brands.map((el) => (
                <Option key={el.slug} value={el.slug}>
                  {el.name}
                </Option>
              ))}
            {type === "category" &&
              category &&
              category.map((el) => (
                <Option key={el.slug} value={el.slug}>
                  {el.name}
                </Option>
              ))}
            {type === "product_group" &&
              productGroup &&
              productGroup.map((el) => (
                <Option key={el.slug} value={el.slug}>
                  {el.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="User Groups" name="user_groups">
          <Select mode="multiple" placeholder="Select user groups" allowClear>
            {userGroups &&
              userGroups.map((el) => (
                <Option key={el.id} value={el.id}>
                  {el.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item className="col-span-full">
          <Button
            htmlType="submit"
            loading={handlePostPromotions.isLoading}
            type="primary"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePromotionsPage;
