import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";

const CustomPageHeader = ({ title, path }) => {
  const navigate = useNavigate();

  return (
    <PageHeader
      className="site-page-header m-0"
      style={{ padding: 0, marginBottom: 16 }}
      title={
        <div className="cursor-pointer" onClick={() => navigate(path || -1)}>
          {title || "Page Title"}
        </div>
      }
      onBack={() => navigate(path || -1)}
    />
  );
};

export default CustomPageHeader;
