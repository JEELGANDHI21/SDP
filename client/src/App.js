import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";

import Login from "./Components/Login";
import Error from "./Components/Error";
import AddProduct from "./Components/AddProduct";
import ProductDetail from "./Components/ProductDetail";
import UserProfile from "./Components/userProfile";
import UserProductDetails from "./Components/UserProductDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route
          path="/userproduct/:productId"
          element={<UserProductDetails />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
