import { Table, Spin, Input } from "antd";
import { uniqBy } from "lodash";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { getOtpRequests } from "../../../context/UserContext";

const OTPRequests = () => {
  const { Search } = Input;

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [otpList, setOtpList] = useState([]);

  const [sortObj, setSortObj] = useState({
    sortType: {
      send_count: false,
      first_created_at: false,
    },
    sort: [],
  });

  const searchText = useRef("");

  let timeout = 0;

  const { data, status, refetch, isRefetching } = useQuery({
    queryKey: ["get-otp-requests"],
    queryFn: () =>
      getOtpRequests({
        page,
        pageSize,
        phone: searchText.current,
        sort: sortObj.sort,
      }),
  });

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setOtpList([]);
      setOtpList((prev) => uniqBy([...prev, ...data.results], "phone"));
    }
  }, [data, status, isRefetching]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortObj]);

  const sortingFn = (header, name) =>
    setSortObj({
      sortType: {
        ...sortObj.sortType,
        [name]: !sortObj.sortType[name],
      },
      sort: [`${sortObj.sortType[name] ? "" : "-"}${header.dataIndex}`],
    });

  const columns = [
    {
      title: "Phone Name",
      dataIndex: "phone",
    },
    {
      title: "First Created At",
      dataIndex: "first_created_at",
      render: (data) => {
        return <div>{moment(data).format("YYYY-MM-DD HH:MM:DD")}</div>;
      },
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "first_created_at"),
        };
      },
    },
    {
      title: "Time of Request",
      dataIndex: "last_otp_sent_at",
      render: (data) => {
        return <div>{moment(data).format("YYYY-MM-DD HH:MM:DD")}</div>;
      },
    },
    {
      title: "Number of Requests",
      dataIndex: "send_count",
      sorter: true,
      onHeaderCell: (header) => {
        return {
          onClick: () => sortingFn(header, "send_count"),
        };
      },
    },
  ];

  return (
    <>
      <div className="text-3xl bg-white mb-3 p-5">OTP List</div>

      <Search
        className="mb-4"
        enterButton="Search"
        placeholder="Search User"
        size="large"
        onChange={(e) => {
          searchText.current = e.target.value;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(refetch, 400);
        }}
      />

      {(status === "loading" || isRefetching) && <Spin />}
      {otpList && (
        <Table
          // onRow={(record) => {
          //   return {
          //     onDoubleClick: (_) => {
          //       navigate("/user/" + record.key);
          //     }, // double click row
          //   };
          // }}
          columns={columns}
          dataSource={otpList}
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
          showSorterTooltip={false}
        />
      )}
    </>
  );
};

export default OTPRequests;
