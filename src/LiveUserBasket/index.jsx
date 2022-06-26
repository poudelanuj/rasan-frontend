import React, { useState } from "react";
import { Spin, Table } from "antd";
import { useQuery } from "react-query";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import { getAllBaskets } from "../context/OrdersContext";
import UserInfo from "./UserInfo";
import BasketInfo from "./BasketInfo";
import BasketModal from "./BasketModal";

const LiveUserBasket = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalBasket, setModalBasket] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: basketsList, status } = useQuery({
    queryFn: () => getAllBaskets(),
    queryKey: "getAllBaskets",
  });

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      render: (_, { user }) => <UserInfo userId={user} />,
    },
    {
      title: "Total Items",
      dataIndex: "totalItems",
      render: (_, { basket_id }) => <BasketInfo basketId={basket_id} />,
    },
    {
      title: "Updated At",
      dataIndex: "last_edited_at",
      render: (_, { last_edited_at }) => {
        return <>{moment(last_edited_at).format("ll")}</>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, data) => (
        <EyeOutlined
          onClick={() => {
            setModalBasket(data);
            setIsModalOpen((prev) => !prev);
          }}
        />
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    onChange: onSelectChange,
  };

  return (
    <div>
      <h2 className="text-2xl my-3">Live User Basket</h2>

      {status === "loading" && (
        <div className="my-8 flex justify-center">
          <Spin />
        </div>
      )}
      {status === "success" && (
        <Table
          columns={columns}
          dataSource={basketsList.map((item) => ({ ...item, key: item.user }))}
          rowSelection={rowSelection}
        />
      )}

      {modalBasket && (
        <BasketModal
          basket={modalBasket}
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LiveUserBasket;
