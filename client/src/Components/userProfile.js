import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import products from "../data/product";

const UserProfile = () => {
  const [userProducts, setUserProducts] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProductsData = async () => {
      const fetchedProducts = await products();
      
      // Filter products based on user's email
      const filteredProducts = fetchedProducts.filter(
        (product) => product.studentId === user.email
      );

      setUserProducts(filteredProducts);
    };

    fetchProductsData();
  }, [user.email]);

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">{user.displayName}'s Profile</h2>
      <div className="mb-4">
        <label className="text-gray-600">Email:</label>
        <p className="text-black">{user.email}</p>
      </div>
      <h3 className="text-xl font-bold mb-2">Products:</h3>
      <ul>
        {userProducts.map((product) => (
          <li key={product.id} className="mb-4">
            <img
              src={product.productPath}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md mr-4"
            />
            <div>
              <h4 className="text-lg font-bold">{product.name}</h4>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
