import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import products from "../data/product";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProductsData = async () => {
      const fetchedProducts = await products();

      const filteredProducts = fetchedProducts.filter(
        (product) => product.studentId === user.email
      );

      setUserProducts(filteredProducts);
    };

    fetchProductsData();
  }, [user.email]);

  return (
    <div className="flex max-w-screen-lg mx-auto mt-8">
      <div className="flex-shrink-0 w-1/3 p-8 bg-white rounded-md shadow-md flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {user.displayName}'s Profile
        </h2>
        <div className="mb-4">
          <p className="text-black text-center">{user.email}</p>
        </div>
      </div>

      <div className="flex-grow p-8 bg-white rounded-md shadow-md">
        <div>
          <h3 className="text-xl font-bold mb-2">Product Details:</h3>
          {userProducts.map((product, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-bold">{product.name}</h4>
              <p className="text-gray-500">Current Price: ${product.price}</p>
              <Link
                to={`/userproduct/${product.id}`}
                className="block mb-4 p-2 bg-blue-500 text-white"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
