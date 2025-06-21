import AddProduct from "../pages/product/AddProduct";
import Signin from "../pages/auth/Signin";
import Home from "../pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/product/Products";
import Layout from "../layouts/AppLayout";
import { GenerateInvoive } from "../pages/invoice/GenerateInvoive";
import Invoices from "../pages/invoice/Invoices";
import InvoiceDetails from "../pages/invoice/InvoiceDetails";
import PrivateRoute from "./PrivateRoute";
import Customers from "../pages/customers/Customers";
import Dashboard from "../pages/dashboard/Dashboard";
import AddCustomer from "../pages/customers/AddCustomer";
import { GenerateCustomerInvoive } from "../pages/invoice/GenerateCustomerInvoive";
import CusomerDetails from "../pages/customers/CusomerDetails";
import EditProduct from "../pages/product/EditProduct";
import EditCustomer from "../pages/customers/EditCustomer";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route index path="/" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        //@ts-ignore
        <Route path="/" element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="product"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
            <Route
            path="/edit-product/:productId"
            element={
              <PrivateRoute>
                <EditProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="/generate-invoice"
            element={
              <PrivateRoute>
                <GenerateInvoive />
              </PrivateRoute>
            }
          />
             <Route
            path="/generate-invoice/:customerId"
            element={
              <PrivateRoute>
                <GenerateCustomerInvoive />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/:invoiceId"
            element={
              <PrivateRoute>
                <InvoiceDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-customer"
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            }
          />
            <Route
            path="/edit-customer/:id"
            element={
              <PrivateRoute>
                <EditCustomer />
              </PrivateRoute>
            }
          />
            <Route
            path="/customer-details/:customerId"
            element={
              <PrivateRoute>
                <CusomerDetails />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
