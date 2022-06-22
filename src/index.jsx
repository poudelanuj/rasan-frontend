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
import ProductListScreen from "./Products/ProductListScreen";
import ProductSkuScreen from "./Products/ProductSkuScreen";
import Brands from "./Products/Brands";
import ProductSKU from "./Products/ProductSKU";
import RequireAuth from "./RequireAuth";
import LoginRasan from "./LoginRasan";
import AuthProvider from "./AuthProvider";
import ViewProductGroup from "./Products/Product Groups/ViewProductGroup";
import ViewProductList from "./Products/ProductList/ViewProductList";

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
