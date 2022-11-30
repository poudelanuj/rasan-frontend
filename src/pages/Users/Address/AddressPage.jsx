import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { isEmpty } from "lodash";
import { Button, Collapse, Form, Input, message, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  createProvince,
  createCity,
  createArea,
  deleteArea,
  deleteCity,
  deleteProvince,
  getAddresses,
  updateProvince,
  updateCity,
  updateArea,
} from "../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import CreateAddress from "./components/CreateAddress";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { openSuccessNotification, openErrorNotification } from "../../../utils";

const AddressPage = () => {
  const { Panel } = Collapse;

  const [provinceForm] = Form.useForm(),
    [cityForm] = Form.useForm(),
    [areaForm] = Form.useForm();

  const [isCreateAddressOpen, setIsCreateAddressOpen] = useState(false);

  const [activeProvincePanel, setActiveProvincePanel] = useState([]);

  const [activeCityPanel, setActiveCityPanel] = useState([]);

  const [provinceInput, setProvinceInput] = useState({ id: null, name: "" });

  const [cityInput, setCityInput] = useState({
    id: null,
    province: null,
    name: "",
  });

  const [areaInput, setAreaInput] = useState({
    id: null,
    city: null,
    name: "",
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
    onError: (err) => openErrorNotification(err),
  });

  const handleCreateCity = useMutation(
    ({ name, province }) => createCity({ name, province }),
    {
      onSuccess: () => {
        cityForm.resetFields();
        refetchAddress();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleCreateArea = useMutation(
    ({ name, city }) => createArea({ name, city }),
    {
      onSuccess: () => {
        areaForm.resetFields();
        refetchAddress();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleUpdateProvince = useMutation(
    ({ id, name }) => updateProvince({ name, id }),
    {
      onSuccess: () => {
        refetchAddress();
        setProvinceInput({ id: null, name: "" });
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleUpdateCity = useMutation(
    ({ id, name, province }) => updateCity({ id, name, province }),
    {
      onSuccess: () => {
        refetchAddress();
        setCityInput({ id: null, province: null, name: "" });
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleUpdateArea = useMutation(
    ({ id, name, city }) => updateArea({ id, name, city }),
    {
      onSuccess: () => {
        refetchAddress();
        setAreaInput({ id: null, city: null, name: "" });
      },
      onError: (err) => openErrorNotification(err),
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
          <Collapse
            key={province.key}
            activeKey={activeProvincePanel}
            destroyInactivePanel
            onChange={(key) => {
              key.length >= 2
                ? setActiveProvincePanel(key[1])
                : setActiveProvincePanel(key);
              cityForm.resetFields();
            }}
          >
            <Panel
              key={province.key}
              extra={
                <Space className="ml-4">
                  {province.id === provinceInput.id ? (
                    <>
                      <Button
                        loading={handleUpdateProvince.isLoading}
                        size="small"
                        type="primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          const provinceExist = !isEmpty(
                            addressTree?.find(
                              (province) =>
                                province.title.toLowerCase() ===
                                provinceInput.name.toLowerCase()
                            )
                          );
                          if (provinceExist)
                            return message.error(
                              `${provinceInput.name} is taken. Try something else`
                            );
                          handleUpdateProvince.mutate(provinceInput);
                        }}
                      >
                        Save
                      </Button>

                      <Button
                        className="!bg-inherit !shadow-none !border-none"
                        icon={<CloseCircleOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          setProvinceInput({ id: null, name: "" });
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      className="!bg-inherit !shadow-none !border-none"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setProvinceInput({
                          id: province.id,
                          name: province.title,
                        });
                      }}
                    />
                  )}

                  <Button
                    className="!bg-inherit !shadow-none !border-none"
                    icon={<DeleteOutlined className="!text-red-500" />}
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();

                      setIsDeleteAddress({
                        isOpen: true,
                        title: `Delete ${province.title}`,
                        id: province.id,
                        deleteMutation: () =>
                          handleDeleteProvince.mutate(province.id),
                      });
                    }}
                  />
                </Space>
              }
              header={
                <Input
                  className={`${
                    province.id !== provinceInput.id &&
                    "pointer-events-none !border-none !bg-inherit !p-0"
                  }`}
                  defaultValue={province.title}
                  value={
                    province.id === provinceInput.id
                      ? provinceInput.name
                      : province.title
                  }
                  onChange={(e) =>
                    setProvinceInput({ ...provinceInput, name: e.target.value })
                  }
                  onClick={(event) =>
                    province.id === provinceInput.id && event.stopPropagation()
                  }
                />
              }
            >
              {province.children.map((city) => (
                <Collapse
                  key={city.key}
                  activeKey={activeCityPanel}
                  destroyInactivePanel
                  onChange={(key) => {
                    key.length >= 2
                      ? setActiveCityPanel(key[1])
                      : setActiveCityPanel(key);
                    areaForm.resetFields();
                  }}
                >
                  <Panel
                    key={city.key}
                    className="mb-4"
                    extra={
                      <Space className="ml-4">
                        {city.id === cityInput.id &&
                        province.id === cityInput.province ? (
                          <>
                            <Button
                              loading={handleUpdateCity.isLoading}
                              size="small"
                              type="primary"
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                const cityExist = addressTree
                                  ?.find(
                                    (Province) => Province.id === province.id
                                  )
                                  .children?.find(
                                    (city) =>
                                      city.title.toLowerCase() ===
                                      cityInput.name.toLowerCase()
                                  );
                                if (cityExist)
                                  return message.error(
                                    `${cityInput.name} is taken. Try something else`
                                  );
                                handleUpdateCity.mutate(cityInput);
                              }}
                            >
                              Save
                            </Button>

                            <Button
                              className="!bg-inherit !shadow-none !border-none"
                              icon={<CloseCircleOutlined />}
                              onClick={(event) => {
                                event.stopPropagation();
                                setCityInput({
                                  id: null,
                                  province: null,
                                  name: "",
                                });
                              }}
                            />
                          </>
                        ) : (
                          <Button
                            className="!bg-inherit !shadow-none !border-none"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              setCityInput({
                                id: city.id,
                                province: province.id,
                                name: city.title,
                              });
                            }}
                          />
                        )}

                        <Button
                          className="!bg-inherit !shadow-none !border-none"
                          icon={<DeleteOutlined className="!text-red-500" />}
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();

                            setIsDeleteAddress({
                              isOpen: true,
                              title: `Delete ${city.title}`,
                              id: city.id,
                              deleteMutation: () =>
                                handleDeleteCity.mutate(city.id),
                            });
                          }}
                        />
                      </Space>
                    }
                    header={
                      <Input
                        className={`${
                          city.id !== cityInput.id &&
                          "pointer-events-none !border-none !bg-inherit !p-0"
                        }`}
                        defaultValue={city.title}
                        value={
                          city.id === cityInput.id &&
                          province.id === cityInput.province
                            ? cityInput.name
                            : city.title
                        }
                        onChange={(e) =>
                          setCityInput({ ...cityInput, name: e.target.value })
                        }
                        onClick={(event) =>
                          city.id === cityInput.id &&
                          province.id === cityInput.province &&
                          event.stopPropagation()
                        }
                      />
                    }
                  >
                    {city.children.map((area, index) => (
                      <div
                        key={area.key}
                        className="bg-[#FAFAFA] mb-4 sm:flex items-center justify-between p-3 border border-stone-300"
                      >
                        <div className="inline-flex items-center gap-1">
                          <p className="my-0">{`${index + 1}.`}</p>
                          <Input
                            className={`${
                              area.id !== areaInput.id &&
                              "pointer-events-none !border-none !bg-inherit !p-0"
                            }`}
                            defaultValue={area.title}
                            value={
                              area.id === areaInput.id &&
                              city.id === areaInput.city
                                ? areaInput.name
                                : area.title
                            }
                            onChange={(e) =>
                              setAreaInput({
                                ...areaInput,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <Space className="ml-4">
                          {area.id === areaInput.id &&
                          city.id === areaInput.city ? (
                            <>
                              <Button
                                loading={handleUpdateArea.isLoading}
                                size="small"
                                type="primary"
                                onClick={(event) => {
                                  event.preventDefault();
                                  const areaExist = addressTree
                                    ?.find(
                                      (Province) => Province.id === province.id
                                    )
                                    .children?.find(
                                      (City) => City.id === city.id
                                    )
                                    .children?.find(
                                      (area) =>
                                        area.title.toLowerCase() ===
                                        areaInput.name.toLowerCase()
                                    );
                                  if (areaExist)
                                    return message.error(
                                      `${areaInput.name} is taken. Try something else`
                                    );
                                  handleUpdateArea.mutate(areaInput);
                                }}
                              >
                                Save
                              </Button>

                              <Button
                                className="!bg-inherit !shadow-none !border-none"
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                  setAreaInput({
                                    id: null,
                                    city: null,
                                    name: "",
                                  });
                                }}
                              />
                            </>
                          ) : (
                            <Button
                              className="!bg-inherit !shadow-none !border-none"
                              icon={<EditOutlined />}
                              size="small"
                              onClick={() => {
                                setAreaInput({
                                  id: area.id,
                                  city: city.id,
                                  name: area.title,
                                });
                              }}
                            />
                          )}

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
                      className={`flex items-start gap-4 ${
                        !isEmpty(city.children) && "!mt-4"
                      }`}
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
                          loading={handleCreateArea.isLoading}
                          type="primary"
                        >
                          Add Area
                        </Button>
                      </Form.Item>
                    </Form>
                  </Panel>
                </Collapse>
              ))}

              <Form
                key={province.id}
                className={`!mt-4 flex items-start gap-4 ${
                  !isEmpty(province.children) && "!mt-4"
                }`}
                form={cityForm}
                size="large"
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
            </Panel>
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
