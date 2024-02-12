import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { sendEmail } from "./sendEmail"; // Import your email sending service

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product } = location.state || {};

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(product?.price || "");

  const handleEditPrice = () => {
    setIsEditingPrice(true);
  };

  const handleSavePrice = async (event) => {
    event.preventDefault();

    // Perform validation (optional)
    if (!editedPrice || isNaN(editedPrice)) {
      alert("Please enter a valid price.");
      return;
    }

    // Update price logic (use API call, state management, etc.)
    // This snippet simulates an update:
    const newPrice = parseFloat(editedPrice);
    const updatedProduct = { ...product, price: newPrice };
    console.log("Updated product:", updatedProduct);

    // Redirect or display confirmation message
    navigate("/home"); // Redirect to product list

    // Optionally send email after update (consider security and user consent):
    // if (window.confirm("Send email notification to user with ID " + product?.studentId + "?")) {
    //   try {
    //     await sendEmail({
    //       to: product?.studentId, // Replace with valid email address
    //       subject: "Product Price Update",
    //       body: `The price of product "${product.name}" has been updated to ${newPrice}.`,
    //     });
    //     alert("Email sent successfully.");
    //   } catch (error) {
    //     console.error("Error sending email:", error);
    //     alert("Failed to send email. Please check your email service configuration.");
    //   }
    // }
  };

  const handleCancelEdit = () => {
    setIsEditingPrice(false);
    setEditedPrice(product?.price || ""); // Reset edited price
  };

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      {product ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-600 mb-2">Category: {product.category}</p>
          <p className="text-gray-600 mb-2">ID: {product.studentId}</p>
          <p className="text-green-600 mb-2">
            Price:{" "}
            {isEditingPrice ? (
              <form className="flex items-center" onSubmit={handleSavePrice}>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded mr-2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <span>
                ${product.price}
                <button
                  onClick={handleEditPrice}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Edit
                </button>
              </span>
            )}
          </p>
          <img className="mt-4" src={product.productPath} alt={product.name} />
        </>
      ) : (
        <p className="text-red-500">No product details available.</p>
      )}
    </div>
  );
};

export default ProductDetail;