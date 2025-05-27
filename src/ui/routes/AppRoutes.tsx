import AddProduct from "../pages/product/AddProduct";
import Signin from "../pages/auth/Signin";
import Home from "../pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/product/Products";
import Layout from "../layouts/AppLayput";
import { GenerateInvoive } from "../pages/invoice/GenerateInvoive";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route index path="/" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        //@ts-ignore
        <Route path="/" element={<Layout />}>
          <Route path="product" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/generate-invoice" element={<GenerateInvoive />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
