import { Form, Select, Button, Input } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { createRedeemableProduct } from "../../../api/loyaltyRedeem";
import { getAllProductSkus } from "../../../api/products/productSku";
import {
  GET_ALL_PRODUCT_SKUS,
  GET_LOYALTY_REDEEM_ARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL,
  GET_LOYALTY_REDEEM_UNARCHIVED_RASAN,
  GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL,
} from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const CreateLoyaltyRedeem = () => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { Option } = Select;

  const [productPack, setProductPack] = useState([]);

  const { data: dropdownProductSku } = useQuery({
    queryFn: () => getAllProductSkus(),
    queryKey: [GET_ALL_PRODUCT_SKUS],
  });

  const handleCreateLoyaltyRedeem = useMutation(
    (data) => createRedeemableProduct(data),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_ARCHIVED_RASAN]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_ARCHIVED_SPECIAL]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_UNARCHIVED_RASAN]);
        queryClient.refetchQueries([GET_LOYALTY_REDEEM_UNARCHIVED_SPECIAL]);
        navigate(-1);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  return (
    <>
      <CustomPageHeader title="Create Loyalty Redeem" />

      <div className="p-6 rounded-lg bg-[#FFFFFF]">
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
              .then((values) => handleCreateLoyaltyRedeem.mutate(values))
          }
        >
          <Form.Item
            className="col-span-full"
            label="Product Sku"
            name="product_sku"
            rules={[
              {
                required: true,
                message: "Please select product sku",
              },
            ]}
          >
            <Select
              placeholder="Select an option"
              onChange={(value) => {
                form.resetFields(["product_pack"]);
                setProductPack(
                  dropdownProductSku &&
                    dropdownProductSku.filter((el) => el.slug === value)[0]
                      .product_packs
                );
              }}
            >
              {dropdownProductSku &&
                dropdownProductSku.map((el) => (
                  <Option key={el.id} value={el.slug}>
                    {el.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Redeem Type"
            name="redeem_type"
            rules={[
              {
                required: true,
                message: "Please select redeem type",
              },
            ]}
          >
            <Select placeholder="Select an option" allowClear>
              <Option value="rasan_deal">Rasan Deals</Option>
              <Option value="special_deal">Special Deals</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Pack"
            name="product_pack"
            rules={[
              {
                required: true,
                message: "Please input product pack",
              },
            ]}
          >
            <Select placeholder="Select an option" allowClear>
              {productPack &&
                productPack.map((el) => (
                  <Option key={el.sn} value={el.number_of_items}>
                    {el.number_of_items}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loyalty Points"
            name="loyalty_points"
            rules={[
              {
                required: true,
                message: "Please input loyalty points",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Quota"
            name="quota"
            rules={[
              {
                required: true,
                message: "Please input quota",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="col-span-full">
            <Button
              htmlType="submit"
              loading={handleCreateLoyaltyRedeem.isLoading}
              type="primary"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateLoyaltyRedeem;
