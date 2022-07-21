import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import AuthProvider from "./AuthProvider";
import "./index.css";
import LoginRasan from "./LoginRasan";

// * Products
import CategoryList from "./pages/Products";
import Brands from "./pages/Products/Brands";
import BrandsScreen from "./pages/Products/BrandsScreen";
import Category from "./pages/Products/Category";
import ViewProductGroup from "./pages/Products/ProductGroups/ViewProductGroup";
import ProductGroupsScreen from "./pages/Products/ProductGroupsScreen";
import AddProduct from "./pages/Products/ProductList/Add";
import ProductList from "./pages/Products/ProductList/ProductView";
import ProductListScreen from "./pages/Products/ProductListScreen";
import ProductSKU from "./pages/Products/ProductSKU";
import ProductSkuScreen from "./pages/Products/ProductSkuScreen";
import EditProduct from "./pages/Products/ProductList/Edit";
import AddProductSku from "./pages/Products/ProductSku/Add";
import EditProductSku from "./pages/Products/ProductSku/Edit";

import RequireAuth from "./RequireAuth";
import "antd/dist/antd.min.css";

// * Users
import Users from "./pages/Users";
import User from "./pages/Users/User";
import OTPRequests from "./pages/Users/OTPRequests";
import UserGroups from "./pages/UserGroups";
import UserGroupPage from "./pages/UserGroups/UserGroupPage";

// * CRM
import Crm from "./pages/CRM";
import UserFeedbacks from "./pages/CRM/UserFeedbacks";
import StockEnquiry from "./pages/CRM/StockEnquiry";
import ViewReturnRequest from "./pages/CRM/ReturnRequest/ViewReturnRequest";
import ViewSupportTicket from "./pages/CRM/SupportTicket/ViewSupportTicket";
import CreateSupportTicket from "./pages/CRM/SupportTicket/CreateSupportTicket";
import EditSupportTicket from "./pages/CRM/SupportTicket/EditSupportTicket";
import SupportTicketList from "./pages/CRM/SupportTicket/SupportTicketList";
import ReturnRequestList from "./pages/CRM/ReturnRequest/ReturnRequestList";
import CreateReturnTicket from "./pages/CRM/ReturnRequest/CreateReturnTicket";

// * Others
import Dashboard from "./pages/Dashboard";
import LiveUserBasket from "./pages/LiveUserBasket";
import Notifications from "./pages/Notifications";
import Orders from "./pages/Orders";

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
              <Route element={<Category />} path="category-list/:slug" />
              <Route
                element={<CategoryList />}
                path="category-list/edit/:slug"
              />

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

              <Route path="product-list">
                <Route element={<ProductListScreen />} index />
                <Route element={<AddProduct />} path="add" />
                <Route element={<ProductList />} path=":slug" />
                <Route element={<EditProduct />} path=":slug/edit" />
              </Route>

              <Route path="product-sku">
                <Route element={<ProductSkuScreen />} index />
                <Route element={<AddProductSku />} path="add" />
                <Route element={<ProductSKU />} path=":slug" />
                <Route element={<EditProductSku />} path=":slug/edit" />
              </Route>

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

              <Route element={<Crm />} path="crm">
                <Route path="support-ticket">
                  <Route element={<SupportTicketList />} index />
                  <Route element={<CreateSupportTicket />} path="create" />
                  <Route
                    element={<EditSupportTicket />}
                    path="edit/:ticketId"
                  />
                  <Route element={<ViewSupportTicket />} path=":ticketId" />
                </Route>
                <Route path="return-request">
                  <Route element={<ReturnRequestList />} index />
                  <Route element={<CreateReturnTicket />} path="create" />
                  <Route element={<ViewReturnRequest />} path=":ticketId" />
                </Route>
                <Route element={<StockEnquiry />} path="stock-enquiry" />
                <Route element={<UserFeedbacks />} path="user-feedbacks" />
              </Route>

              <Route element={<Notifications />} path="notifications" />
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
