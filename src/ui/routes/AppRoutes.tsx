import AddProduct from "../pages/product/AddProduct";
import Signin from "../pages/auth/Signin";
import Home from "../pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/product/Products";
import Layout from "../layouts/AppLayput";
import { GenerateInvoive } from "../pages/invoice/GenerateInvoive";
import Invoices from "../pages/invoice/Invoices";
import InvoiceDetails from "../pages/invoice/InvoiceDetails";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route index path="/" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        //@ts-ignore
        <Route path="/" element={<Layout />}>
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
            path="/generate-invoice"
            element={
              <PrivateRoute>
                <GenerateInvoive />
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
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
