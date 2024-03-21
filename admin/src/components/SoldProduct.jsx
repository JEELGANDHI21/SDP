import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SoldProduct = () => {
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    const fetchSoldProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/soldproducts');
        setSoldProducts(response.data);
      } catch (error) {
        console.error('Error fetching sold products:', error);
      }
    };

    fetchSoldProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sold Products</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Path</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {soldProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.productPath}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.ownerId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.acceptedId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.acceptedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoldProduct;
