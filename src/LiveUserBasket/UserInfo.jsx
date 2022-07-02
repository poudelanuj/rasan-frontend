import { Spin } from "antd";
import { useQuery } from "react-query";
import { getUserInfo } from "../context/OrdersContext";

const UserInfo = ({ userId }) => {
  const { data, status } = useQuery({
    queryFn: () => getUserInfo(userId),
    queryKey: ["getUserInfo", userId],
    enabled: !!userId,
  });

  return (
    <>
      {status === "loading" && <Spin size="small" />}
      {status === "success" && (
        <>
          {data?.full_name} {data?.phone}
        </>
      )}
    </>
  );
};

export default UserInfo;
