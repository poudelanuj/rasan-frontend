import { Table } from "antd";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { getOtpRequests } from "../../context/UserContext";
const columns = [
  {
    title: "Phone Name",
    dataIndex: "phone",
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
  },
];

const OTPRequests = () => {
  const { data: otpList } = useQuery("get-otp-requests", getOtpRequests);
  // useEffect(() => {
  //   if (otpList) {
  //     let users2 = otpList.map((user, index) => {
  //       return {
  //         key: index,

  //       };
  //     });
  //     setUserColumns(users2);
  //   }
  // }, [otpList]);
  return (
    <>
      {" "}
      <div className="text-3xl bg-white mb-3 p-5">OTP List</div>
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
        />
      )}
    </>
  );
};

export default OTPRequests;
