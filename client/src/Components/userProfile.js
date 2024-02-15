import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import products from "../data/product";

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

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="flex max-w-screen-lg mx-auto mt-8">
      <div className="flex-shrink-0 w-1/3 p-8 bg-white rounded-md shadow-md flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">{user.displayName}'s Profile</h2>
        <div className="mb-4">
          <p className="text-black text-center">{user.email}</p>
        </div>
      </div>

      <div className="flex-grow p-8 bg-white rounded-md shadow-md">
        {selectedProduct ? (
          <div>
            <h3 className="text-xl font-bold mb-2">Product Details:</h3>
            <div className="mb-4">
              <h4 className="text-lg font-bold">{selectedProduct.name}</h4>
              <p className="text-gray-500">Current Price: ${selectedProduct.price}</p>
              <h4 className="text-lg font-bold">Offers:</h4>
              <ul>
                {selectedProduct.offers.map((offer, index) => (
                  <li key={index} className="mb-2">
                    <p>User ID: {offer.userId}</p>
                    <p>Offer Amount: ${offer.offerAmount}</p>
                    <p>Date and Time: {new Date(offer.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-2">Products:</h3>
            <ul>
              {userProducts.map((product, index) => (
                <li key={product.id} className={`mb-4 ${index !== 0 ? 'border-t border-gray-300 pt-4' : ''} flex items-center`}>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold">{product.name}</h4>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleViewProduct(product)}>
                    View Product
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
