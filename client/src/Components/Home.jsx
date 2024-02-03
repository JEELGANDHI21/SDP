import React from "react";
import { Link } from "react-router-dom";
import Headers from "./Header";

const Home = () => {
  return (
    <div>
      <Headers />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <Link to="/add-product">Add Product</Link>
    </div>
  );
};

export default Home;
