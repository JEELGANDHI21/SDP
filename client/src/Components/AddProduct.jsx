import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddArt = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    imagePath: null, // Change to null for file input
  });
  const [userdata, setUserdata] = useState({});
  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/sucess", {
        withCredentials: true,
      });

      setUserdata(response.data.user);
      console.log(userdata)
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

      // Now, construct the data object with the updated objectUrl
      const data = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        productPath: responseData.objectUrl, // Use responseData.objectUrl directly
        studentId: userId,
      };
      console.log(data);

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
    <div >
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
      
        <div >
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div >
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div >
          <label>Price:</label>
          <input
            type="text"
           
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Product Path (File Location):</label>
          <input
            type="file"
            
            name="artPath"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddArt;
