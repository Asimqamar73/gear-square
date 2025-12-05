import AddProduct from "../pages/product/AddProduct";
import Signin from "../pages/auth/Signin";
import Home from "../pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/product/Products";
import Layout from "../layouts/AppLayout";
import { GenerateInvoice } from "../pages/invoice/GenerateInvoice";
import Invoices from "../pages/invoice/Invoices";
import InvoiceDetails from "../pages/invoice/InvoiceDetails";
import PrivateRoute from "./PrivateRoute";
import Customers from "../pages/customers/Customers";
import Dashboard from "../pages/dashboard/Dashboard";
import AddCustomer from "../pages/customers/AddCustomer";
import { GenerateCustomerInvoive } from "../pages/invoice/GenerateCustomerInvoive";
import CusomerDetails from "../pages/customers/CustomerDetails";
import EditProduct from "../pages/product/EditProduct";
import EditCustomer from "../pages/customers/EditCustomer";
import VehicleDetails from "../pages/vehicle/vehicleDetails";
import { GenerateVehicleServiceInvoice } from "../pages/invoice/GenerateVehicleServiceInvoice";
import { EditCustomerInvoice } from "../pages/invoice/EditCustomerInvoice";

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
                <GenerateInvoice />
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
            path="/generate-service-invoice/:vehicleId"
            element={
              <PrivateRoute>
                <GenerateVehicleServiceInvoice />
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
            path="/edit-invoice/:invoiceId"
            element={
              <PrivateRoute>
                <EditCustomerInvoice />
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
          // Vehicle details
             <Route
            path="/vehicle-details/:vehicleId"
            element={
              <PrivateRoute>
                <VehicleDetails />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
