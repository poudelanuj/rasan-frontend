import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import { Provider as UserProvider } from "./context/UserContext";
import Users from "./Users";
import UserGroups from "./UserGroups";
import LiveUserBasket from "./LiveUserBasket";
import CRM from "./CRM";
import LoginApp from "./Login/LoginApp";
import User from "./Users/User";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/login" element={<LoginApp />} />
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route
            path="users"
            element={
              <UserProvider>
                <Users />
              </UserProvider>
            }
          />
          <Route
            path="user/:user_id"
            element={
              <UserProvider>
                <User />
              </UserProvider>
            }
          />
          <Route path="user-groups" element={<UserGroups />} />
          <Route path="live-user-basket" element={<LiveUserBasket />} />
          <Route path="crm" element={<CRM />} />
        </Route>
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
