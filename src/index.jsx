import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import AuthProvider from "./AuthProvider";
import CRM from "./CRM";
import Dashboard from "./Dashboard";
import "./index.css";
import LiveUserBasket from "./LiveUserBasket";
import LoginRasan from "./LoginRasan";
import Orders from "./Orders";
import CategoryList from "./Products";
import Brands from "./Products/Brands";
import BrandsScreen from "./Products/BrandsScreen";
import Category from "./Products/Category";
import ViewProductGroup from "./Products/Product Groups/ViewProductGroup";
import ProductGroupsScreen from "./Products/ProductGroupsScreen";
import ViewProductList from "./Products/ProductList/ViewProductList";
import ProductListScreen from "./Products/ProductListScreen";
import ProductSKU from "./Products/ProductSKU";
import ProductSkuScreen from "./Products/ProductSkuScreen";
import RequireAuth from "./RequireAuth";
import UserGroups from "./UserGroups";
import UserGroupPage from "./UserGroups/UserGroupPage";
import Users from "./Users";
import OTPRequests from "./Users/OTPRequests";
import User from "./Users/User";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <React.StrictMode>
          <Routes>
            <Route element={<LoginRasan />} path="/login" />
            <Route
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
              path="/"
            >
              <Route element={<Dashboard />} index />
              <Route element={<Orders />} path="orders" />

              {/* product part */}
              <Route element={<CategoryList />} path="category-list" />
              <Route element={<CategoryList />} path="category-list/add" />
              <Route
                element={<CategoryList />}
                path="category-list/edit/:slug"
              />
              <Route element={<Category />} path="category-list/:slug" />

              <Route element={<BrandsScreen />} path="brands" />
              <Route element={<BrandsScreen />} path="brands/add" />
              <Route element={<BrandsScreen />} path="brands/edit/:slug" />
              <Route element={<Brands />} path="brands/:slug" />

              <Route element={<ProductGroupsScreen />} path="product-groups" />
              <Route
                element={<ProductGroupsScreen />}
                path="product-groups/add"
              />
              <Route
                element={<ViewProductGroup />}
                path="product-groups/:slug"
              />
              <Route
                element={<ViewProductGroup />}
                path="product-groups/:slug/edit"
              />

              <Route element={<ProductListScreen />} path="product-list" />
              <Route element={<ProductListScreen />} path="product-list/add" />
              <Route element={<ViewProductList />} path="product-list/:slug" />
              <Route
                element={<ViewProductList />}
                path="product-list/:slug/edit"
              />

              <Route element={<ProductSkuScreen />} path="product-sku" />
              <Route element={<ProductSkuScreen />} path="product-sku/add" />
              <Route element={<ProductSKU />} path="product-sku/:slug" />
              <Route element={<ProductSKU />} path="product-sku/:slug/edit" />

              <Route
                element={<ProductSKU />}
                path="product-sku/:slug/add-product-pack"
              />
              <Route
                element={<ProductSKU />}
                path="product-sku/:slug/edit-product-pack/:id"
              />

              {/* ends */}
              <Route element={<Users />} path="users" />
              <Route element={<User />} path="user/:user_id" />
              <Route element={<OTPRequests />} path="otp-requests" />
              <Route element={<UserGroups />} path="user-groups" />
              <Route element={<UserGroupPage />} path="user-group/:group_id" />

              <Route element={<LiveUserBasket />} path="live-user-basket" />
              <Route element={<CRM />} path="crm" />
            </Route>
          </Routes>
        </React.StrictMode>
      </AuthProvider>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();