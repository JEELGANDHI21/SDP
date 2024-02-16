import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/product";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState(null);
  const [hasMadeOffer, setHasMadeOffer] = useState(false);
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

  const handleUpdatePrice = async () => {
    try {
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

  if (!product) {
    return (
      <div>
        <h2>Product Not Found</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-4 flex">
        <img
          src={product.productPath}
          alt={product.name}
          className="w-1/2 h-auto mr-4"
        />
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 text-sm mb-4">{product.description}</p>
          <p className="text-gray-700 text-sm">
            Category: {product.category} | ID: {product.studentId}
          </p>

          <div className="flex items-center mb-4">
            <label className="mr-2">Price:</label>
            <input
              type="number"
              min="0"
              max={product.price * 3}
              step="1"
              value={updatedPrice || product.price}
              onChange={handlePriceChange}
              className="w-16 border rounded-md p-1"
            />
            <span className="ml-2">{updatedPrice || product.price} ₹</span>
          </div>
          <button
            onClick={handleUpdatePrice}
            disabled={hasMadeOffer}
            className={`px-4 py-2 ${
              hasMadeOffer ? "bg-gray-400" : "bg-blue-500"
            } text-white rounded-md focus:outline-none ${
              hasMadeOffer ? "cursor-not-allowed" : ""
            }`}
          >
            {hasMadeOffer ? "Offer Made" : "Make Offer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
