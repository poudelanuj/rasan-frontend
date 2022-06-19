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
import CategoryList from "./Products";
import UserGroups from "./UserGroups";
import Users from "./Users";
import User from "./Users/User";
import { ReactQueryDevtools } from "react-query/devtools";
import OTPRequests from "./Users/OTPRequests";
import Category from "./Products/Category";
import BrandsScreen from "./Products/BrandsScreen";
import ProductGroupsScreen from "./Products/ProductGroupsScreen";
import RequireAuth from "./RequireAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <RequireAuth>
        <React.StrictMode>
          <Routes>
            <Route element={<LoginApp />} path="/login" />
            <Route element={<App />} path="/">
              <Route element={<Dashboard />} index />
              <Route element={<Orders />} path="orders" />
              {/* product part */}

              <Route element={<CategoryList />} path="category-list" />
              <Route element={<CategoryList />} path="category-list/add" />
              <Route element={<Category />} path="category-list/:slug" />
              <Route element={<BrandsScreen />} path="brands" />
              <Route element={<BrandsScreen />} path="brands/add" />
              <Route element={<ProductGroupsScreen />} path="product-groups" />

              {/* ends */}
              <Route element={<Users />} path="users" />
              <Route element={<User />} path="user/:user_id" />
              <Route element={<OTPRequests />} path="otp-requests" />
              <Route element={<UserGroups />} path="user-groups" />
              <Route element={<LiveUserBasket />} path="live-user-basket" />
              <Route element={<CRM />} path="crm" />
            </Route>
          </Routes>
        </React.StrictMode>
      </RequireAuth>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
