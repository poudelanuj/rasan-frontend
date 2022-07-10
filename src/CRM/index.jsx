import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const CRM = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split("?")[0];
    if (path === "/crm" || path === "/crm/") {
      navigate("support-ticket");
    }
  }, [location, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CRM;
