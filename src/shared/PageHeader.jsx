import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";

const CustomPageHeader = ({ title, path, isBasicHeader }) => {
  const navigate = useNavigate();

  if (isBasicHeader) {
    return <h2 className="text-2xl">{title}</h2>;
  }

  return (
    <PageHeader
      className="site-page-header m-0"
      style={{ padding: 0, marginBottom: 16, textTransform: "capitalize" }}
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
