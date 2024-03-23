import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import products from "../data/product";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProductDetails = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [acceptedOfferId, setAcceptedOfferId] = useState(null);
  const [rejectedOfferIds, setRejectedOfferIds] = useState([]);
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [expiryDate, setExpiryDate] = useState("Not available");

  useEffect(() => {
    // Check if productDetails and acceptedOfferId are available
    if (productDetails && acceptedOfferId) {
      const offer = productDetails.offers.find(
        (offer) => offer._id === acceptedOfferId && offer.otp
      );

      if (offer && offer.otp && offer.otp.expires) {
        const expiryDate = new Date(offer.otp.expires).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        });
        setExpiryDate(expiryDate);
      } else {
        setExpiryDate("Not available");
      }
    }
  }, [productDetails, acceptedOfferId]);

  const navigate = useNavigate();


  const generateOTP = () => {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOTP);
    return generatedOTP;
  };

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
        const acceptedOffer = selectedProduct.offers.find(
          (offer) => offer.offerStatus === "accepted"
        );
        if (acceptedOffer) {
          setAcceptedOfferId(acceptedOffer._id);
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAcceptOffer = async (offerId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to accept this offer?"
    );

    if (!userConfirmed) {
      return;
    }
    const generatedOTP = generateOTP();
    setOtpSent(true);
    if (acceptedOfferId !== null || rejectedOfferIds.includes(offerId)) {
      console.warn("Offer already accepted or rejected.");
      return;
    }
    try {
      const email1 = productDetails.offers.find(
        (offer) => offer._id === offerId
      )?.userId;
      const amount = productDetails.offers.find(
        (offer) => offer._id === offerId
      )?.offerAmount;


      const response = await fetch(
        `http://localhost:8080/api/products/acceptOffer/${productId}/${offerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerStatus: "accepted",
            otp: generatedOTP,
          }),
        }
      );

      if (response.ok) {
        setAcceptedOfferId(offerId);



        alert("Offer accepted successfully!");
        await fetch("http://localhost:8080/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: user.email,
            to: email1,
            subject: "Your Offer has been Accepted!",
            image: productDetails.productPath,
            productinfo: `Name : ${productDetails.name}`,
            body: `Congratulations! Your offer of ₹${amount} has been accepted.
            Your OTP for offer verification is: ${generatedOTP}
            Kindly reach out to this mail id : ${productDetails.studentId}`,
          }),
        });
      } else {
        console.error("Error accepting offer:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
    }

  };

  const handleRejectOffer = async (offerId) => {
    if (rejectedOfferIds.includes(offerId) || acceptedOfferId !== null) {
      console.warn("Offer already accepted or rejected.");
      return;
    }
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
      } else {
        console.error("Error rejecting offer:", response.statusText);
      }
    } catch (error) {
      console.error("Error rejecting offer:", error);
    }
  };
  const handleInputChange = (event) => {
    setAdditionalInfo(event.target.value);
  };


  const handleVerifyOTP = async () => {
    const acceptedOffer = productDetails.offers.find(
      (offer) => offer._id === acceptedOfferId
    );

    if (!acceptedOffer) {
      console.error("No accepted offer found.");
      return;
    }

    const otptoverify = acceptedOffer?.otp;

    const currentTimestamp = new Date();

    if (!otptoverify || new Date(otptoverify.expires) < currentTimestamp) {
      console.error("OTP has expired or does not exist.");
      try {
        const response = await axios.put(
          `http://localhost:8080/api/products/setOfferStatus/${productId}/${acceptedOffer._id}`,
          {
            offerStatus: "pending",
          }
        );

        if (response.status === 200) {
          console.log("Offer status set to pending successfully.");


          const deleteOTPres = await axios.delete(
            `http://localhost:8080/api/products/deleteOTP/${productId}/${acceptedOffer._id}`
          );

          if (deleteOTPres.status === 200) {
            console.log("Expired OTP deleted successfully.");
          } else {
            console.error("Error deleting expired OTP:", deleteOTPres.statusText);
          }
        } else {
          console.error("Error setting offer status to pending:", response.statusText);
        }
      } catch (error) {
        console.error("Error setting offer status to pending:", error);
      }

      window.alert("OTP is expired. The offer has been cancelled.");
      window.location.reload();
      return;
    }


    const userEnteredOTP = additionalInfo;
    const generatedOTP = otptoverify.value;

    if (userEnteredOTP === generatedOTP) {
      console.log("OTP verified successfully!");



      const acceptedid = acceptedOffer.userId;
      const amount = acceptedOffer.offerAmount;

      const data = {
        id: productDetails.id,
        name: productDetails.name,
        category: productDetails.category,
        price: productDetails.price,
        productPath: productDetails.productPath,
        description: productDetails.description,
        ownerId: productDetails.studentId,
        acceptedId: acceptedid,
        acceptedAmount: amount,
      };

      try {
        const response = await axios.post(
          "http://localhost:8080/add-soldproduct",
          data
        );

        if (response.status === 200) {
          console.log("Product added successfully!");

          try {
            const deleteResponse = await axios.delete(
              `http://localhost:8080/delete-product/${productDetails.id}`
            );

            if (deleteResponse.status === 200) {
              console.log("Product deleted successfully!");
              alert("Product sold successfully!! Thank You For Using BuyNSellHub 😊");
              navigate("/home");
            } else {
              console.error("Error deleting product:", deleteResponse.data);
            }
          } catch (error) {
            console.error("Error deleting product:", error);
          }
        } else {
          console.error("Error adding sold product:", response.data);
        }
      } catch (error) {
        console.error("Error parsing server response:", error);
      }
    } else {
      alert("Your OTP is Invalid")
      console.error("Invalid OTP. Please try again.");
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex-shrink-0 w-full max-w-screen-lg p-8">
        <div className="flex max-w-screen-lg mx-auto">
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
                      <h4 className="text-lg font-bold">Accepted Offer</h4>
                      <p>
                        UserID :
                        {
                          productDetails.offers.find(
                            (offer) => offer._id === acceptedOfferId
                          )?.userId
                        }
                      </p>
                      <p className="text-gray-500 mb-2 font-bold">
                        Expiry: {expiryDate}
                      </p>  
                      <input
                        type="text"
                        placeholder="Enter Validation OTP"
                        value={additionalInfo}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 w-full"
                      />
                      <button
                        onClick={handleVerifyOTP}
                        className="mt-4 px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md focus:ring-4 focus:outline-none focus:ring-orange-300"
                      >
                        Verify OTP
                      </button>
                    </div>
                  ) : (
                    productDetails.offers.map((offer, index) => (
                      <div key={index} className="mb-4">
                        <p className="text-lg font-bold">Offer {index + 1}</p>
                        <p className=" font-bold">UserID : {offer.userId}</p>
                        <p className="text-gray-500 mb-2 font-bold">
                          Price : {offer.offerAmount} ₹
                        </p>
                        <p className="text-base text-gray-700 leading-tight mb-2">
                          <span className="font-medium text-gray-900">
                            Date & Time:
                          </span>
                          <span className="ml-2">
                            {new Date(offer.date).toLocaleString("en-US")}
                          </span>
                        </p>

                        {rejectedOfferIds.includes(offer._id) ? (
                          <p>Status: rejected</p>
                        ) : (
                          <div>
                            <button
                              className="bg-green-500 text-white px-4 py-2 mr-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300"
                              onClick={() => handleAcceptOffer(offer._id)}
                              disabled={
                                acceptedOfferId !== null ||
                                rejectedOfferIds.includes(offer._id)
                              }
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300"
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
      </div>
    </div>
  );
};

export default UserProductDetails;