import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import products from "../data/product";

const UserProductDetails = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [acceptedOfferId, setAcceptedOfferId] = useState(null);
  const [rejectedOfferIds, setRejectedOfferIds] = useState([]);
  // const [rejectedOfferId, setRejectedOfferId] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const allProducts = await products();
        const selectedProduct = allProducts.find(
          (product) => product.id === productId
        );

        if (!selectedProduct) {
          console.error(`Product with ID ${productId} not found.`);
          return;
        }

        setProductDetails(selectedProduct);
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const allProducts = await products();
        const selectedProduct = allProducts.find(
          (product) => product.id === productId
        );

        if (!selectedProduct) {
          console.error(`Product with ID ${productId} not found.`);
          return;
        }

        setProductDetails(selectedProduct);
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAcceptOffer = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/acceptOffer/${productId}/${offerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerStatus: "accepted",
          }),
        }
      );

      if (response.ok) {
        setAcceptedOfferId(offerId);
      } else {
        console.error("Error accepting offer:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/rejectOffer/${productId}/${offerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerStatus: "rejected",
          }),
        }
      );

      if (response.ok) {
        setRejectedOfferIds([...rejectedOfferIds, offerId]);
        // setRejectedOfferId(offerId);
      } else {
        console.error("Error rejecting offer:", response.statusText);
      }
    } catch (error) {
      console.error("Error rejecting offer:", error);
    }
  };

  return (
    <div className="flex max-w-screen-lg mx-auto mt-8">
      <div className="flex-shrink-0 w-1/3 p-8 bg-white rounded-md shadow-md">
        <img
          src={productDetails?.productPath}
          alt={productDetails?.name}
          className="w-full h-auto"
        />
      </div>

      <div className="flex-grow p-8 bg-white rounded-md shadow-md">
        {productDetails ? (
          <div>
            <div>
              {acceptedOfferId ? (
                <div className="mb-4">
                  <p className="text-lg">Accepted Offer</p>
                  <p>
                    UserID : $
                    {
                      productDetails.offers.find(
                        (offer) => offer._id === acceptedOfferId
                      )?.userId
                    }
                  </p>
                  <p>
                    Price : $
                    {
                      productDetails.offers.find(
                        (offer) => offer._id === acceptedOfferId
                      )?.offerAmount
                    }
                  </p>
                </div>
              ) : (
                productDetails.offers.map((offer, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg">Offer {index + 1}</p>
                    <p>UserID : ${offer.userId}</p>
                    <p>Price: ${offer.offerAmount}</p>

                    {rejectedOfferIds.includes(offer._id) ? (
                      <p>Status: rejected</p>
                    ) : (
                      <div>
                        <button
                          className="bg-green-500 text-white px-4 py-2 mr-2"
                          onClick={() => handleAcceptOffer(offer._id)}
                          disabled={
                            acceptedOfferId !== null ||
                            rejectedOfferIds.includes(offer._id)
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2"
                          onClick={() => handleRejectOffer(offer._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default UserProductDetails;
