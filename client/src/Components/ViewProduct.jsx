import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Headers from "./Header";
import products from "../data/product";
import Fuse from "fuse.js";

const ViewProduct = () => {
  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const fuse = new Fuse(productsList, {
    keys: ["name"],
    threshold: 0.3,
  });

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

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProductsData = async () => {
      const fetchedProducts = await products();
      setProductsList(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    };

    fetchProductsData();
  }, []);

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
  const handleBuyNow = (productId) => {
    const selectedProduct = productsList.find(
      (product) => product.id === productId
    );

    // Navigate to the product detail page with the product ID as a parameter
    navigate(`/product/${productId}`, { state: { product: selectedProduct } });
  };

  return (
    <div>
      <Headers />

      {/* Category filter buttons */}
      <div className="flex justify-center my-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Notes">Notes</option>
          <option value="ICs">ICs</option>
          <option value="Books">Books</option>
          {/* Add options for each category */}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by product name..."
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="max-w-md mx-auto overflow-hidden bg-white rounded-md shadow-md hover:shadow-lg">
            <img
              src={item.productPath}
              alt={item.name}
              className="w-full h-48 object-cover"
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
                  onClick={() => handleBuyNow(item.id)}
                  className="px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:ring-4 focus:outline-none focus:ring-orange-300">
                  View Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProduct;
