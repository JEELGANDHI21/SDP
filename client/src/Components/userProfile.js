import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import products from "../data/product";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [userOfferedProducts, setUserOfferedProducts] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProductsData = async () => {
      const fetchedProducts = await products();

      const userAddedProducts = fetchedProducts.filter(
        (product) => product.studentId === user.email
      );

      const offeredProducts = fetchedProducts.filter((product) =>
        product.offers.some((offer) => offer.userId === user.email)
      );

      setUserProducts(userAddedProducts);
      setUserOfferedProducts(offeredProducts);
    };

    fetchProductsData();
  }, [user.email]);

  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-8 bg-white rounded-md shadow-md flex flex-col justify-center">
      <h2 className="text-3xl font-extrabold text-center mb-10">
        {user.displayName}'s Profile
      </h2>
      <div className="flex justify-between">
        <div className="w-1/2 pr-4 ">
          <h3 className="text-xl font-bold mb-5">Your Added Products:</h3>
          {userProducts.map((product, index) => (
            <div key={index} className="mb-10">
              <h4 className="text-lg font-bold">
                Product's Name : {product.name}
              </h4>
              <p className="text-gray-500 mb-2 font-bold">
                Price: {product.price} ₹
              </p>
              <Link
                to={`/userproduct/${product.id}`}
                className="mt-4 px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md focus:ring-4 focus:outline-none focus:ring-orange-300"
              >
                View Product
              </Link>
            </div>
          ))}
       
        <div className="max-w-screen-lg">
          <h3 className="text-xl font-bold mb-5">Products with Your Offers:</h3>
          {userOfferedProducts.length > 0 ? (
            <table className="max-w-screen-lg border-collapse border">
              <thead>
                <tr >
                  <th className="border p-10 text-left">Product Name</th>
                  <th className="border p-10 text-left">Product Owner</th>
                  <th className="border p-10 text-left">Original Price</th>
                  <th className="border p-10 text-left">Amount</th>
                  <th className="border p-10 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {userOfferedProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border p-5 text-lg font-bold">
                      {product.name}
                    </td>
                    <td className="border p-5 font-bold">
                      {product.studentId}
                    </td>
                    <td className="border p-5 text-gray-500 font-bold">
                      ₹{product.price}
                    </td>
                    <td className="border p-5">
                      {product.offers && product.offers.length > 0 ? (
                        <ul>
                          {product.offers
                            .filter((offer) => offer.userId === user.email)
                            .map((userOffer, offerIndex) => (
                              <li
                                className="text-gray-500 font-bold mb-2"
                                key={offerIndex}
                              >
                                ₹{userOffer.offerAmount}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        "No offers"
                      )}
                    </td>
                    <td className="border p-5">
                      {product.offers && product.offers.length > 0 ? (
                        <ul>
                          {product.offers
                            .filter((offer) => offer.userId === user.email)
                            .map((userOffer, offerIndex) => (
                              <li
                                className={
                                  userOffer.offerStatus === "rejected"
                                    ? "text-red-500"
                                    : userOffer.offerStatus === "accepted"
                                    ? "text-green-500"
                                    : ""
                                }
                                key={offerIndex}
                              >
                                {userOffer.offerStatus}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        "No offers"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products with offers found.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
