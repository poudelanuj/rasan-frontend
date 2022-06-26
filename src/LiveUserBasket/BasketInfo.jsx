import { Spin } from "antd";
import { useQuery } from "react-query";
import { getBasketInfo } from "../context/OrdersContext";

const BasketInfo = ({ basketId }) => {
  const { data, status } = useQuery({
    queryFn: () => getBasketInfo(basketId),
    queryKey: ["getBasketInfo", basketId],
    enabled: !!basketId,
  });

  return (
    <>
      {status === "loading" && <Spin size="small" />}
      {status === "success" && <>{data?.items?.length}</>}
    </>
  );
};

export default BasketInfo;
