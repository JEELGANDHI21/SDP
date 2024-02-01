import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Error from "./Components/Error";
import AddProduct from "./Components/AddProduct";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;