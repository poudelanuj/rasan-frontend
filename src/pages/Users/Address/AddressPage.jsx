import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { isEmpty } from "lodash";
import { Button, Collapse, Form, Input, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createProvince,
  createCity,
  createArea,
  deleteArea,
  deleteCity,
  deleteProvince,
  getAddresses,
} from "../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import CreateAddress from "./components/CreateAddress";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { openSuccessNotification, openErrorNotification } from "../../../utils";

const AddressPage = () => {
  const [provinceForm] = Form.useForm(),
    [cityForm] = Form.useForm(),
    [areaForm] = Form.useForm();

  const [isCreateAddressOpen, setIsCreateAddressOpen] = useState(false);

  const [cityCollapseKey, setCityCollapseKey] = useState({
    shouldTrigger: false,
    key: [],
  });

  const [isDeleteAddress, setIsDeleteAddress] = useState({
    id: null,
    isOpen: false,
    title: "",
    deleteMutation: () => {},
  });

  const { data: addressList, refetch: refetchAddress } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const handleCreateProvince = useMutation((name) => createProvince(name), {
    onSuccess: () => {
      provinceForm.resetFields();
      refetchAddress();
    },
  });

  const handleCreateCity = useMutation(
    ({ name, province }) => createCity({ name, province }),
    {
      onSuccess: () => {
        cityForm.resetFields();
        refetchAddress();
      },
    }
  );

  const handleCreateArea = useMutation(
    ({ name, city }) => createArea({ name, city }),
    {
      onSuccess: () => {
        areaForm.resetFields();
        refetchAddress();
      },
    }
  );

  const handleDeleteProvince = useMutation((id) => deleteProvince(id), {
    onSuccess: (res) => {
      openSuccessNotification(res.message);
      refetchAddress();
      setIsDeleteAddress({ id: null, isOpen: false, title: "" });
    },
    onError: (err) => openErrorNotification(err),
  });

  const handleDeleteCity = useMutation((id) => deleteCity(id), {
    onSuccess: (res) => {
      openSuccessNotification(res.message);
      refetchAddress();
      setIsDeleteAddress({ id: null, isOpen: false, title: "" });
    },
    onError: (err) => openErrorNotification(err),
  });

  const handleDeleteArea = useMutation((id) => deleteArea(id), {
    onSuccess: (res) => {
      openSuccessNotification(res.message);
      refetchAddress();
      setIsDeleteAddress({ id: null, isOpen: false, title: "" });
    },
    onError: (err) => openErrorNotification(err),
  });

  const addressTree = addressList?.map((province) => ({
    title: province.name,
    key: province.name,
    id: province.id,
    children: province.cities?.map((city) => ({
      title: city.name,
      key: city.name,
      id: city.id,
      children: city.areas?.map((area) => ({
        title: area.name,
        key: area.name,
        id: area.id,
      })),
    })),
  }));

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-fit"
        type="primary"
        ghost
        onClick={() => setIsCreateAddressOpen(true)}
      >
        Add New Address
      </Button>

      {addressTree &&
        addressTree.map((province) => (
          <Collapse key={province.key} accordion>
            <Collapse.Panel
              key={province.key}
              extra={
                <Space>
                  <Button
                    className="!bg-inherit !shadow-none !border-none"
                    icon={<EditOutlined />}
                    size="small"
                  />

                  <Button
                    className="!bg-inherit !shadow-none !border-none"
                    icon={<DeleteOutlined className="!text-red-500" />}
                    size="small"
                    onClick={() =>
                      setIsDeleteAddress({
                        isOpen: true,
                        title: `Delete ${province.title}`,
                        id: province.id,
                        deleteMutation: () =>
                          handleDeleteProvince.mutate(province.id),
                      })
                    }
                  />
                </Space>
              }
              header={province.title}
            >
              {province.children.map((city) => (
                <Collapse key={city.key}>
                  <Collapse.Panel
                    key={city.key}
                    className="mb-4"
                    extra={
                      <Space>
                        <Button
                          className="!bg-inherit !shadow-none !border-none"
                          icon={<EditOutlined />}
                          size="small"
                        />

                        <Button
                          className="!bg-inherit !shadow-none !border-none"
                          icon={<DeleteOutlined className="!text-red-500" />}
                          size="small"
                          onClick={() =>
                            setIsDeleteAddress({
                              isOpen: true,
                              title: `Delete ${city.title}`,
                              id: city.id,
                              deleteMutation: () =>
                                handleDeleteCity.mutate(city.id),
                            })
                          }
                        />
                      </Space>
                    }
                    header={city.title}
                  >
                    {city.children.map((area, index) => (
                      <div
                        key={area.key}
                        className="bg-[#FAFAFA] mb-4 sm:flex items-center justify-between p-3 border border-stone-300"
                      >
                        <p className="my-0">{`${index + 1}.  ${area.title}`}</p>

                        <Space>
                          <Button
                            className="!bg-inherit !shadow-none !border-none"
                            icon={<EditOutlined />}
                            size="small"
                          />

                          <Button
                            className="!bg-inherit !shadow-none !border-none"
                            icon={<DeleteOutlined className="!text-red-500" />}
                            size="small"
                            onClick={() =>
                              setIsDeleteAddress({
                                isOpen: true,
                                title: `Delete ${area.title}`,
                                id: area.id,
                                deleteMutation: () =>
                                  handleDeleteArea.mutate(area.id),
                              })
                            }
                          />
                        </Space>
                      </div>
                    ))}

                    <Form
                      key={city.id}
                      className="!mt-4 flex items-start gap-4"
                      form={areaForm}
                      size="large"
                      onFinish={() =>
                        areaForm.validateFields().then((values) =>
                          handleCreateArea.mutate({
                            city: city.id,
                            name: values.area,
                          })
                        )
                      }
                    >
                      <Form.Item
                        className="!mb-0"
                        name="area"
                        rules={[
                          {
                            required: true,
                            message: "Please provide area name",
                          },
                          {
                            validator: (_, value) => {
                              if (
                                !isEmpty(
                                  addressTree
                                    ?.find(
                                      (Province) => Province.id === province.id
                                    )
                                    .children?.find(
                                      (City) => City.id === city.id
                                    )
                                    .children?.find(
                                      (area) =>
                                        area.title.toLowerCase() ===
                                        value?.toLowerCase()
                                    )
                                )
                              ) {
                                return Promise.reject(
                                  `${value} already exists`
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input placeholder="Area" />
                      </Form.Item>

                      <Form.Item className="!mb-0">
                        <Button
                          htmlType="submit"
                          loading={handleDeleteArea.isLoading}
                          type="primary"
                        >
                          Add Area
                        </Button>
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                </Collapse>
              ))}

              <Form
                key={province.id}
                className="!mt-4 flex items-start gap-4"
                form={cityForm}
                size="large"
                onFieldsChange={() =>
                  setCityCollapseKey((prev) =>
                    prev.filter((key) => key !== province.title)
                  )
                }
                onFinish={() =>
                  cityForm.validateFields().then((values) =>
                    handleCreateCity.mutate({
                      province: province.id,
                      name: values.city,
                    })
                  )
                }
              >
                <Form.Item
                  className="!mb-0"
                  name="city"
                  rules={[
                    { required: true, message: "Please provide city name" },
                    {
                      validator: (_, value) => {
                        if (
                          !isEmpty(
                            addressTree
                              ?.find((Province) => Province.id === province.id)
                              .children?.find(
                                (city) =>
                                  city.title.toLowerCase() ===
                                  value?.toLowerCase()
                              )
                          )
                        ) {
                          return Promise.reject(`${value} already exists`);
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="City" />
                </Form.Item>

                <Form.Item className="!mb-0">
                  <Button
                    htmlType="submit"
                    loading={handleCreateCity.isLoading}
                    type="primary"
                  >
                    Add City
                  </Button>
                </Form.Item>
              </Form>
            </Collapse.Panel>
          </Collapse>
        ))}

      <Form
        className="flex items-start gap-4"
        form={provinceForm}
        size="large"
        onFinish={() =>
          provinceForm
            .validateFields()
            .then((values) => handleCreateProvince.mutate(values.province))
        }
      >
        <Form.Item
          name="province"
          rules={[
            { required: true, message: "Please provide province name" },
            {
              validator: (_, value) => {
                if (
                  !isEmpty(
                    addressTree?.find(
                      (province) =>
                        province.title.toLowerCase() === value?.toLowerCase()
                    )
                  )
                ) {
                  return Promise.reject(`${value} already exists`);
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Province" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={handleCreateProvince.isLoading}
            type="primary"
          >
            Add Province
          </Button>
        </Form.Item>
      </Form>

      <CreateAddress
        isCreateAddressOpen={isCreateAddressOpen}
        setIsCreateAddressOpen={setIsCreateAddressOpen}
      />

      <ConfirmDelete
        closeModal={() =>
          setIsDeleteAddress({ id: null, isOpen: false, title: "" })
        }
        deleteMutation={() => isDeleteAddress.deleteMutation()}
        isOpen={isDeleteAddress.isOpen}
        title={isDeleteAddress.title}
      />
    </div>
  );
};

export default AddressPage;
