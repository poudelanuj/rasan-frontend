import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Input, Spin, Menu, Select, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { isEmpty, uniqBy } from "lodash";
import { getUsers } from "../../../api/users";
import { getAddresses } from "../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import CreateUserModal from "./CreateUserModal";
const { Search } = Input;

const UserList = () => {
  let navigate = useNavigate();

  const searchText = useRef();
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const [selectedArea, setSelectedArea] = useState({
    province: null,
    city: null,
    area: [],
    isAreaChanged: false,
  });

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const [sortObj, setSortObj] = useState({
    sortType: {
      id: true,
      full_name: true,
    },
    sort: [],
  });

  let timeout = 0;

  const { data, refetch, isRefetching, status } = useQuery({
    queryKey: [
      "get-users",
      page.toString() + pageSize.toString(),
      sortObj.sort,
    ],
    queryFn: () =>
      getUsers(page, searchText.current, pageSize, sortObj.sort, {
        province: selectedArea.province,
        city: selectedArea.city,
        area: selectedArea.area,
      }),
  });

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setUsers([]);
      setUsers((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortObj, pageSize, selectedArea]);

  const userColumns = users.map((user) => {
    return {
      key: user.id,
      id: user.id,
      full_name: user.full_name || "N/A",
      phone: user.phone,
      profile_picture: user.profile_picture?.small_square_crop,
      shop: user.shop.name || "N/A",
      address: user.addresses[0]?.detail_address || "N/A",
      loyalty_points: user?.extra_info?.loyalty_points || 0,
    };
  });

  const sorting = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record) => (
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate(`/user/${record.key}`)}
        >
          #{text}
        </span>
      ),
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sorting(header, "id"),
        };
      },
    },
    {
      title: "Customer Name",
      dataIndex: "full_name",
      width: "25%",
      render: (text, record) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => navigate("/user/" + record.key)}
          >
            {record.profile_picture && (
              <img
                alt={"text"}
                className="inline pr-4 rounded-[50%]"
                src={record.profile_picture}
                style={{ borderRadius: "50%" }}
                width={50}
              />
            )}{" "}
            <span className="w-16" style={{ overflowWrap: "anywhere" }}>
              {text}
            </span>
          </div>
        );
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sorting(header, "full_name"),
        };
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      render: (_, { phone, key }) => (
        <span
          className="cursor-pointer"
          onClick={() => navigate("/user/" + key)}
        >
          {phone}
        </span>
      ),
    },

    {
      title: "Shop Name",
      dataIndex: "shop",
      width: "18%",
      render: (_, { shop }) => (
        <span className="w-20" style={{ overflowWrap: "anywhere" }}>
          {shop}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "18%",
      render: (_, { address }) => (
        <span className="w-20" style={{ overflowWrap: "anywhere" }}>
          {address}
        </span>
      ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyalty_points",
    },
  ];

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
          province: addressList?.find(
            (province) => province.id === Number(e.keyPath[1])
          )?.name,
          city: addressList
            ?.find((province) => province.id === Number(e.keyPath[1]))
            ?.cities?.find((city) => city.id === Number(e.key))?.name,
          area: [],
          isAreaChanged: false,
        }));
      }}
    />
  );

  return (
    <>
      <div className="flex sm:flex-row flex-col mb-4 gap-2">
        <div className="flex gap-2 w-full">
          <ButtonWPermission
            codename="add_user"
            type="primary"
            ghost
            onClick={() => setIsCreateUserOpen(true)}
          >
            Add User
          </ButtonWPermission>

          <Search
            placeholder="Search User"
            onChange={(e) => {
              searchText.current = e.target.value;
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(() => {
                setPage(1);
                refetch();
              }, 400);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Dropdown overlay={addressMenu}>
            <Button className="bg-white" type="default">
              {selectedArea.city ?? "Select city"}
              <DownOutlined />
            </Button>
          </Dropdown>

          <Select
            className="sm:!w-96 sm:flex-none flex-1"
            disabled={!selectedArea.city}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            mode="multiple"
            optionFilterProp="children"
            options={addressList
              ?.find((province) => province.name === selectedArea.province)
              ?.cities?.find((city) => city.name === selectedArea.city)
              ?.areas?.map((area) => ({ value: area.name, label: area.name }))}
            placeholder="Search to Select Area"
            style={{ width: 200 }}
            value={selectedArea.area}
            showSearch
            onChange={(val) =>
              setSelectedArea((prev) => ({
                ...prev,
                area: val,
                isAreaChanged: true,
              }))
            }
          />

          <Button
            className="bg-white"
            disabled={!selectedArea.city}
            type="default"
            onClick={() =>
              setSelectedArea({
                city: null,
                province: null,
                area: [],
                isAreaChanged: true,
              })
            }
          >
            Clear
          </Button>
        </div>
      </div>

      {(status === "loading" || isRefetching) && <Spin />}

      {userColumns && (
        <Table
          columns={columns}
          dataSource={userColumns}
          pagination={{
            showSizeChanger: true,
            pageSize,
            total: data?.count,
            current: page,

            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          scroll={{ x: !isEmpty(userColumns) && 1000 }}
          showSorterTooltip={false}
        />
      )}

      <CreateUserModal
        isCreateUserOpen={isCreateUserOpen}
        refetchUserList={refetch}
        setIsCreateUserOpen={setIsCreateUserOpen}
      />
    </>
  );
};

export default UserList;
