import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Headers from "./Header";
import products from "../data/product";

const ViewProduct = () => {
  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
        <label className="mr-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          <option value="Notes">Notes</option>
          <option value="ICs">ICs</option>
          <option value="Books">Books</option>
         
          {/* Add options for each category */}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="max-w-md mx-auto mb-8 overflow-hidden bg-white rounded shadow-lg"
          >
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
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  Buy Now
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
