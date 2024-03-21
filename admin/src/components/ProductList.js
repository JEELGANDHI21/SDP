import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/get-products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">ID</th>
            <th className="border border-gray-200 px-4 py-2">Name</th>
            <th className="border border-gray-200 px-4 py-2">Category</th>
            <th className="border border-gray-200 px-4 py-2">Price</th>
            <th className="border border-gray-200 px-4 py-2">Product Path</th>
            <th className="border border-gray-200 px-4 py-2">Description</th>
            <th className="border border-gray-200 px-4 py-2">Student ID</th>
            <th className="border border-gray-200 px-4 py-2">Offers</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id} className="border border-gray-200">
              <td className="border border-gray-200 px-4 py-2">{product.product_id}</td>
              <td className="border border-gray-200 px-4 py-2">{product.name}</td>
              <td className="border border-gray-200 px-4 py-2">{product.category}</td>
              <td className="border border-gray-200 px-4 py-2">{product.price}</td>
              <td className="border border-gray-200 px-4 py-2">{product.productPath}</td>
              <td className="border border-gray-200 px-4 py-2">{product.description}</td>
              <td className="border border-gray-200 px-4 py-2">{product.studentId}</td>
              <td className="border border-gray-200 px-4 py-2">
                {product.offers.map((offer, index) => (
                  <ul key={index}>
                    <li>
                      {Object.entries(offer).map(([key, value]) => {
                        if (key === 'otp' && typeof value === 'object') {
                          return Object.entries(value).map(([otpKey, otpValue]) => (
                            <div key={otpKey}>
                              {otpKey}: {otpValue}
                            </div>
                          ));
                        } else {
                          return (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          );
                        }
                      })}
                    </li>
                  </ul>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
