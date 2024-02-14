import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Headers from "./Header";
import { setLogin } from "../userData/store";



const Home = () => {
  const [userdata, setUserdata] = useState({});
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/sucess", {
        withCredentials: true,
      });

      if (response.data.message) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      }

      // console.log(setLogin);
      setUserdata(response.data.user);
      console.log("Userdata : ", userdata);
      dispatch(
        setLogin({
          user: response.data.user,
          token : response.data.token
        })
      );
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
