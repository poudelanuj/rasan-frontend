import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Collapse, Space, Table, message } from "antd";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import CustomPageHeader from "../../../shared/PageHeader";
import {
  deleteAddressRoute,
  getAddressRoute,
} from "../../../api/userAddresses";
import CreateRoute from "./CreateRoute";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const { Panel } = Collapse;

export default function AddressRoute() {
  const [config, setConfig] = useState({
    page: 1,
    size: 20,
  });

  const [isDelete, setIsDelete] = useState({
    isOpen: false,
    id: null,
    name: null,
  });

  const [isCreate, setIsCreate] = useState({ data: null, isOpen: false });

  const { data, refetch } = useQuery({
    queryFn: () => getAddressRoute(config),
    queryKey: ["ADDRESS_ROUTE", config],
  });

  const handleDeleteAddress = useMutation((id) => deleteAddressRoute(id), {
    onSuccess: (res) => {
      refetch();
      openSuccessNotification("Address route deleted");
      setIsDelete({ isOpen: false, id: null, name: null });
    },
    onError: (err) => openErrorNotification(err),
  });

  const column = [
    {
      key: "id",
      dataIndex: "id",
      title: "S.N.",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Area",
    },
  ];

  return (
    <>
      <CustomPageHeader title="Address Route" isBasicHeader />

      <div className="bg-white !p-6 flex flex-col gap-6 rounded-lg">
        <Button
          className="w-fit"
          type="primary"
          ghost
          onClick={() => setIsCreate({ data: null, isOpen: true })}
        >
          Create new route
        </Button>

        <Collapse>
          {data?.results?.map((address) => (
            <Panel
              key={address.id}
              extra={
                <Space>
                  <Button
                    className="!bg-inherit !shadow-none !border-none"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsCreate({
                        data: address,
                        isOpen: true,
                      });
                    }}
                  />

                  <Button
                    className="!bg-inherit !shadow-none !border-none"
                    icon={<CloseCircleOutlined />}
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsDelete({
                        isOpen: true,
                        name: address.name,
                        id: address.id,
                      });
                    }}
                  />
                </Space>
              }
              header={address.name}
            >
              <Table
                columns={column}
                dataSource={address?.areas}
                pagination={false}
              />
            </Panel>
          ))}
        </Collapse>

        <CreateRoute
          closeModal={() => setIsCreate({ data: null, isOpen: false })}
          data={isCreate.data}
          isOpen={isCreate.isOpen}
        />

        <ConfirmDelete
          closeModal={() =>
            setIsDelete({ isOpen: false, id: null, name: null })
          }
          deleteMutation={() => handleDeleteAddress.mutate(isDelete.id)}
          isOpen={isDelete.isOpen}
          status={handleDeleteAddress.status}
          title={`Delete ${isDelete.name}?`}
        />
      </div>
    </>
  );
}
