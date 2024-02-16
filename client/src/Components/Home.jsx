import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Headers from "./Header";

import products from "../data/product";
import Fuse from "fuse.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);

  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fuse = new Fuse(productsList, {
    keys: ["name"],
    threshold: 0.3,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsData = async () => {
      const fetchedProducts = await products();
      setProductsList(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    };

    fetchProductsData();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const results = fuse.search(query);
      setFilteredProducts(results.map((r) => r.item));
    } else {
      setFilteredProducts(productsList);
    }
  };

  const filterProductsByCategory = (category) => {
    if (category === "All") {
      setFilteredProducts(productsList);
    } else {
      const filtered = productsList.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterProductsByCategory(category);
  };

  const handleViewDetails = (productId) => {
    const product = productsList.find((item) => item.id === productId);

    if (product) {
      setSelectedProduct(product);
      navigate(`/product/${productId}`);
    } else {
      console.error(`Product with id ${productId} not found.`);
    }
  };

  return (
    <>
      <Headers style={{ padding: "0.5rem 1 rem" }} />
      <div className="container mx-auto">
        <div className="flex justify-center my-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
          <option value={"All"}>All</option>
            <option value="Books">Textbooks</option>
            <option value="Notes">Notes</option>
            <option value="Mechanical Products">Electronics Products</option>
            <option value="Mechanical Products">Mechanical Products</option>
            <option value="ICs">ICs</option>
            <option value="ICs">Others</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by product name..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="max-w-md mx-auto bg-white rounded-md shadow-md hover:shadow-lg"
              style={{ width: "300px", height: "400px" }} // Fixed size
            >
              <img
                src={item.productPath}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-md"
                style={{ height: "200px" }} // Adjust the height of the image
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-700 text-sm mb-4">{item.description}</p>
                <p className="text-gray-700 text-sm">
                  Category: {item.category} | ID: {item.studentId}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-green-600 font-bold text-sm">
                    Price: {item.price}
                  </p>
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:ring-4 focus:outline-none focus:ring-orange-300"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
