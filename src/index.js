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
import AddCategory from "./Products/AddCategory"; 
import Category from "./Products/Category";
import BrandsScreen from "./Products/BrandsScreen";
import ProductGroupsScreen from "./Products/ProductGroupsScreen";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route path="/login" element={<LoginApp />} />
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            {/* product part */}

            <Route path="category-list" element={<CategoryList />} />
            <Route path="category-list/add" element={<CategoryList />} />
            <Route path="category-list/:slug" element={<Category />} />
            <Route path="brands" element={<BrandsScreen />} />
            <Route path="brands/add" element={<BrandsScreen />} />
            <Route path="product-groups" element={<ProductGroupsScreen />} />

            {/* ends */}
            <Route path="users" element={<Users />} />
            <Route path="user/:user_id" element={<User />} />
            <Route path="user-groups" element={<UserGroups />} />
            <Route path="live-user-basket" element={<LiveUserBasket />} />
            <Route path="crm" element={<CRM />} />
          </Route>
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
