import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Headers from "./Header";

const Home = () => {
  const [userdata, setUserdata] = useState({});

  const getUser = async () => {
    try {
      const response = await axios
        .get("http://localhost:8080/login/sucess", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.message) {
            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
            }
          }
        });
      setUserdata(response.data.user);
      console.log(userdata);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Headers />
      <Link to="/add-product" className="block mb-4 p-2 bg-blue-500 text-white">
        Add Product
      </Link>
      <Link
        to="/view-product"
        className="block mb-4 p-2 bg-blue-500 text-white"
      >
        View Product
      </Link>
    </div>
  );
};

export default Home;
