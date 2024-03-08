import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/product";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState(null);
  const [hasMadeOffer, setHasMadeOffer] = useState(false);
  const [notification, setNotification] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productList = await products();
      const selectedProduct = productList.find((item) => item.id === productId);

      if (selectedProduct) {
        setProduct(selectedProduct);
        setUpdatedPrice(selectedProduct.price);
        const hasOfferInStorage = localStorage.getItem(
          `offer_${user.email}_${productId}`
        );
        setHasMadeOffer(Boolean(hasOfferInStorage));
        console.error(`Product with id ${productId} not found.`);
      }
    };

    fetchProductDetails();
  }, [productId, user.offers]);

  const handlePriceChange = (event) => {
    const enteredPrice = parseFloat(event.target.value);
    const clampedPrice = Math.min(Math.max(enteredPrice, 0), product.price * 3);
    setUpdatedPrice(clampedPrice);
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleUpdatePrice = async () => {
    try {
      const hasOfferInStorage = localStorage.getItem(
        `offer_${user.email}_${productId}`
      );

      if (hasOfferInStorage) {
        console.log("Offer already made for this product.");
        return;
      }

      if (user.email === product.studentId) {
        showNotification("You cannot make an offer on your own product.");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/products/updateOffer/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userOffer: updatedPrice,
            userId: user.email,
            offerStatus: "pending",
          }),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        localStorage.setItem(`offer_${user.email}_${productId}`, "true");
        setHasMadeOffer(true);
      } else {
        console.error("Error updating product offer:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating product offer:", error);
    }
  };

  if (!product) {
    return (
      <div>
        <h2>Product Not Found</h2>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-5xl p-8 flex bg-white rounded-xl shadow-lg">
        <img
          src={product.productPath}
          alt={product.name}
          className="w-80 h-auto mr-8"
        />
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
          <p className="text-xl font-bold">Description : </p>
          <p className=" mb-2">{product.description}</p>
          <p className="text-black text-lg font-semibold">Category : </p>
          <p className=" mb-2">{product.category}</p>
          <p className=" font-bold"> ID :</p>
          <p className=" mb-2"> {product.studentId}</p>

          <div className="flex items-center mb-6">
            <label className="mr-4 text-lg">Price:</label>
            <input
              type="number"
              min="0"
              max={product.price * 3}
              step="1"
              value={updatedPrice || product.price}
              onChange={handlePriceChange}
              className="w-24 border rounded-md p-2 text-lg"
            />
            <span className="ml-4 text-lg">
              {updatedPrice || product.price} ₹         
            </span>
          </div>
          <button
            onClick={handleUpdatePrice}
            disabled={hasMadeOffer}
            className={`px-6 py-3 shadow-btn ${
              hasMadeOffer ? "bg-gray-400" : "bg-orange-600"
            } text-white rounded-md focus:outline-none ${
              hasMadeOffer ? "cursor-not-allowed" : ""
            } text-lg`}
          >
            {hasMadeOffer ? "Offer Made" : "Make Offer"}
          </button>

          {notification && (
            <div className="notification absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-md">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
