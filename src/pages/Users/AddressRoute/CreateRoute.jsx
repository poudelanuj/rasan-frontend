import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, Input, Modal, Menu, Dropdown, Button, Select } from "antd";
import { getAddresses, updateAddressRoute } from "../../../api/userAddresses";
import { DownOutlined } from "@ant-design/icons";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import { createAddressRoute } from "../../../api/userAddresses";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

export default function CreateRoute({ isOpen, closeModal, data }) {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const [selectedArea, setSelectedArea] = useState({
    province: null,
    city: null,
  });

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const handleCreateAddress = useMutation((data) => createAddressRoute(data), {
    onSuccess: (res) => {
      openSuccessNotification("Address route created");
      queryClient.refetchQueries(["ADDRESS_ROUTE"]);
      form.resetFields();
      setSelectedArea({ province: null, city: null });
      closeModal();
    },
    onError: (err) => openErrorNotification(err),
  });

  const handleUpdateAddress = useMutation(
    ({ id, data }) => updateAddressRoute(id, data),
    {
      onSuccess: (res) => {
        openSuccessNotification("Address route updated");
        queryClient.refetchQueries(["ADDRESS_ROUTE"]);
        form.resetFields();
        setSelectedArea({ province: null, city: null });
        closeModal();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const addressMenu = (
    <Menu
      items={addressList?.map((address) => ({
        key: address.id,
        label: address.name,
        children: address.cities?.map((city) => ({
          key: city.id,
          label: city.name,
        })),
      }))}
      onClick={(e) => {
        setSelectedArea(() => ({
          province: e.keyPath[1],
          city: e.key,
        }));
        form.resetFields(["areas"]);
      }}
    />
  );

  useEffect(() => {
    if (data) {
      let selectedCity = null;

      for (const province of addressList) {
        for (const city of province.cities) {
          for (const area of city.areas) {
            if (data.areas.some(({ id }) => id === area.id))
              selectedCity = city;
          }
        }
      }

      selectedCity &&
        setSelectedArea({
          city: selectedCity?.id,
          province: selectedCity.province,
        });

      form.setFieldsValue({
        name: data.name,
        areas: data.areas?.map((area) => area.id),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal
      footer={null}
      title={data ? "Update route" : "Create new address route"}
      visible={isOpen}
      onCancel={closeModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) =>
          data
            ? handleUpdateAddress.mutate({ id: data.id, data: values })
            : handleCreateAddress.mutate(values)
        }
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <div className="flex gap-6">
          <Form.Item className="!mb-0" label="City">
            <Dropdown overlay={addressMenu}>
              <Button className="bg-white" type="default">
                {addressList
                  ?.find(
                    (province) => province.id === Number(selectedArea.province)
                  )
                  ?.cities?.find(
                    (city) => city.id === Number(selectedArea.city)
                  )?.name ?? "Select city"}
                <DownOutlined />
              </Button>
            </Dropdown>
          </Form.Item>

          <Form.Item
            className="!mb-0 !flex-1"
            label="Areas"
            name="areas"
            rules={[
              {
                required: true,
                message: "Area is required",
              },
            ]}
          >
            <Select
              className="!w-full"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              mode="multiple"
              optionFilterProp="children"
              options={addressList
                ?.find(
                  (province) => province.id === Number(selectedArea.province)
                )
                ?.cities?.find((city) => city.id === Number(selectedArea.city))
                ?.areas?.map((area) => ({
                  value: area.id,
                  label: area.name,
                }))}
              placeholder="Search to Select Area"
              style={{ width: 200 }}
              showSearch
            />
          </Form.Item>
        </div>

        <Form.Item className="!mb-0">
          <div className="flex gap-4 justify-end mt-6">
            <Button htmlType="submit" type="primary">
              {data ? "Update" : "Create"}
            </Button>

            <Button type="primary" ghost onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
