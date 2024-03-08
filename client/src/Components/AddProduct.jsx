import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Headers from "./Header";

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imagePath: null, // Change to null for file input
  });

  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

  const isFileTypeValid = (file) => {
    return allowedFileTypes.includes(file.type);
  };

  const [userdata, setUserdata] = useState({});

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/sucess", {
        withCredentials: true,
      });

      setUserdata(response.data.user);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const userId = userdata?.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const response = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    try {
      const responseData = await response.json();
      console.log("Server Response:", responseData);

      const uploadResponse = await fetch(responseData.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      console.log("Image uploaded successfully:", uploadResponse);

      const data = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        productPath: responseData.objectUrl,
        description: formData.description,
        studentId: userId,
      };

      try {
        const response = await axios.post(
          "http://localhost:8080/add-product",
          data
        );
        console.log("Product added:", response.data);
        navigate("/home");
      } catch (error) {
        console.error("Error creating product:", error);
      }
    } catch (error) {
      console.error("Error parsing server response:", error);
    }
  };

  return (
    
     <>
      <Headers />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Choose a category
              </option>
              <option value="Textbooks">Textbooks</option>
              <option value="Notes">Notes</option>
              <option value="Electronics Products">Electronics Products</option>
              <option value="Mechanical Products">Mechanical Products</option>
              <option value="ICs">ICs</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Price:
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Short Description:
            </label>
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter a short description..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Product Path (File Location):
            </label>
            <input
              type="file"
              name="artPath"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const selectedFile = e.target.files[0];
                  if (isFileTypeValid(selectedFile)) {
                    handleFileChange(e);
                  } else {
                    alert("Please select a valid JPG, PNG, or JPEG file.");
                    e.target.value = null;
                  }
                }
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".jpg, .jpeg, .png"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-black shadow-btn focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Product
          </button>
        </form>
      </div>
    </>
    
  );
};

export default AddProduct;
