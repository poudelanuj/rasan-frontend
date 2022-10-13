import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";

const CustomPageHeader = ({
  title,
  path,
  isBasicHeader,
  breadcrumb,
  avatar,
  subTitle,
  extra,
  children,
}) => {
  const navigate = useNavigate();

  if (isBasicHeader) {
    return (
      <div className="bg-white px-6 pt-4 pb-1 mb-6 rounded-b-lg relative">
        <h2 className="text-2xl">{title}</h2>
        {children && <span className="absolute right-6 top-4">{children}</span>}
      </div>
    );
  }

  return (
    <div className="bg-white pt-4 px-4 pb-1 mb-6 rounded-b-lg">
      <PageHeader
        avatar={avatar}
        breadcrumb={breadcrumb}
        className="site-page-header m-0"
        extra={extra}
        style={{ padding: 0, marginBottom: 16, textTransform: "capitalize" }}
        subTitle={subTitle}
        title={
          <div className="cursor-pointer" onClick={() => navigate(path || -1)}>
            {title || "Page Title"}
          </div>
        }
        onBack={() => navigate(path || -1)}
      />
    </div>
  );
};

export default CustomPageHeader;
