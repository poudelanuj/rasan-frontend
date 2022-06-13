import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import CRM from "./CRM";
import Dashboard from "./Dashboard";
import "./index.css";
import LiveUserBasket from "./LiveUserBasket";
import LoginApp from "./Login/LoginApp";
import Orders from "./Orders";
import Products from "./Products";
import UserGroups from "./UserGroups";
import Users from "./Users";
import User from "./Users/User";
import { ReactQueryDevtools } from "react-query/devtools";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route element={<LoginApp />} path="/login" />
          <Route element={<App />} path="/">
            <Route element={<Dashboard />} index />
            <Route element={<Orders />} path="orders" />
            <Route element={<Products />} path="products" />
            <Route element={<Users />} path="users" />
            <Route element={<User />} path="user/:user_id" />
            <Route element={<UserGroups />} path="user-groups" />
            <Route element={<LiveUserBasket />} path="live-user-basket" />
            <Route element={<CRM />} path="crm" />
          </Route>
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
