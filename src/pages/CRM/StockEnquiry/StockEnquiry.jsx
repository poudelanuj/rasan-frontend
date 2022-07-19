import { Breadcrumb, Tabs, Table } from "antd";
import { useQuery } from "react-query";
import moment from "moment";
import getAllStockEnquiries from "../../../api/crm/stockEnquiry";
import Loader from "../../../shared/Loader";

const StockEnquiry = () => {
  const { data: enquiriesList, status } = useQuery({
    queryFn: () => getAllStockEnquiries(),
    queryKey: ["get-all-stock-enquiries"],
  });

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <>#{text}</>,
    },
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Phone Number",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Enquiry Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <>{moment(created_at).format("ll")}</>;
      },
    },
  ];

  return (
    <>
      {status === "loading" && <Loader isOpen />}
      <div className="py-4">
        <Breadcrumb>
          <Breadcrumb.Item>CRM</Breadcrumb.Item>
          <Breadcrumb.Item>
            <>Stock Enquiry</>
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="text-2xl my-3">Out of Stock Enquiry</h2>

        <div>
          <Tabs defaultActiveKey="all">
            <Tabs.TabPane key="all" tab="All">
              <Table columns={columns} dataSource={enquiriesList} />
            </Tabs.TabPane>
            <Tabs.TabPane key="archived" tab="Archived">
              <Table columns={columns} dataSource={enquiriesList} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default StockEnquiry;
