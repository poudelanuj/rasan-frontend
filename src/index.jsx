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
import CategoryList from "./pages/Products/categories";
import ViewBrand from "./pages/Products/Brands/ViewBrand";
import BrandsScreen from "./pages/Products/Brands";
import Category from "./pages/Products/categories/ViewCategory";
import ViewProductGroup from "./pages/Products/ProductGroups/ViewProductGroup";
import ProductGroupsScreen from "./pages/Products/ProductGroups";
import ProductList from "./pages/Products/ProductList/ProductView";
import ProductListScreen from "./pages/Products/ProductList";
import ProductSKU from "./pages/Products/ProductSku/ViewProductSKU";
import ProductSkuScreen from "./pages/Products/ProductSku/index";
import AddProduct from "./pages/Products/ProductList/AddProduct";
import EditProduct from "./pages/Products/ProductList/EditProduct";
import AddProductSku from "./pages/Products/ProductSku/AddProductSku";
import EditProductSku from "./pages/Products/ProductSku/EditProductSku";

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

// * Orders
import Orders from "./pages/Orders";
import CreateOrder from "./pages/Orders/components/CreateOrder";

// * Others
import Dashboard from "./pages/Dashboard";
import LiveUserBasket from "./pages/LiveUserBasket";
import Notifications from "./pages/Notifications";
import ViewOrderPage from "./pages/Orders/components/ViewOrderPage";

// *CMS
import About from "./pages/cms/About";
import Tutorial from "./pages/cms/Tutorial";
import CreateTutorial from "./pages/cms/Tutorial/components/CreateTutorial";
import UpdateTutorial from "./pages/cms/Tutorial/components/UpdateTutorial";
import ViewFAQSPage from "./pages/cms/About/ViewFAQSPage";

// *Promotions
import Promotions from "./pages/Promotions";
import CreatePromotionsPage from "./pages/Promotions/components/CreatePromotionsPage";
import ViewPromotionsPage from "./pages/Promotions/components/ViewPromotionsPage";
import UpdatePromotionsPage from "./pages/Promotions/components/UpdatePromotionsPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 5 * 1000 * 60,
    },
  },
});

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

              <Route path="orders">
                <Route element={<Orders />} index />
                <Route element={<CreateOrder />} path="create-order" />
                <Route element={<ViewOrderPage />} path="view-order/:orderId" />
              </Route>

              <Route path="category-list">
                <Route element={<CategoryList />} index />
                <Route element={<CategoryList />} path="add" />
                <Route element={<Category />} path=":slug" />
                <Route element={<CategoryList />} path="edit/:slug" />
              </Route>

              <Route path="brands">
                <Route element={<BrandsScreen />} index />
                <Route element={<BrandsScreen />} path="add" />
                <Route element={<BrandsScreen />} path="edit/:slug" />
                <Route element={<ViewBrand />} path=":slug" />
              </Route>

              <Route path="product-groups">
                <Route element={<ProductGroupsScreen />} index />
                <Route element={<ProductGroupsScreen />} path="add" />
                <Route element={<ViewProductGroup />} path=":slug" />
                <Route element={<ViewProductGroup />} path=":slug/edit" />
              </Route>

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

              <Route path="cms">
                <Route element={<About />} index />
                <Route element={<Tutorial />} path="tutorial" />
                <Route element={<CreateTutorial />} path="tutorial/create" />
                <Route
                  element={<UpdateTutorial />}
                  path="tutorial/update/:slug"
                />
                <Route element={<ViewFAQSPage />} path="faqs/:groupId" />
              </Route>

              <Route path="promotions">
                <Route element={<Promotions />} index />
                <Route element={<ViewPromotionsPage />} path=":promotionsId" />
                <Route element={<CreatePromotionsPage />} path="create" />
                <Route
                  element={<UpdatePromotionsPage />}
                  path="update/:promotionsId"
                />
              </Route>

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
