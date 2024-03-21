import React, { useEffect, useState } from "react";
import axios from "axios";
import "./header.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setLogin } from "../userData/store";

const Headers = () => {
  const [userdata, setUserdata] = useState({});
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("Header ", user);
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
      setToken(response.data.token);
      setUserdata(response.data.user);
      console.log("Userdata : ", userdata);
      console.log("Token", token);
      dispatch(
        setLogin({
          user: response.data.user,
          token: response.data.token,
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
  const handleLogout = () => {
    // localStorage.removeItem("token");

    setUserdata({});
    setToken("");

    dispatch(
      setLogin({
        user: {},
        token: "",
      })
    );

    navigate("/login");
  };

  return (
    <>
      <header className="gradient-bg flex items-center justify-between px-4 py-0 md:px-6">
        <h1 className="text-white text-2xl font-bold">BuyNSellHub</h1>
        <nav className="flex items-center">
          <ul className="flex items-center space-x-6 ml-auto">
            {Object?.keys(userdata)?.length > 0 ? (
              <>
                <li>
                  <NavLink
                    to="/home"
                    className="text-white hover:text-gray-300 text-xl hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/add-product"
                    className="text-white hover:text-gray-300  text-xl  hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out"
                  >
                    Add Product
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    onClick={handleLogout}
                    className="text-white hover:text-gray-300  text-xl hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out"
                  >
                    Logout
                  </NavLink>
                </li>
                <li>
                  <a href="/user-profile">
                    <img
                      src={userdata?.image}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </a>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className="text-white hover:text-gray-300 hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Headers;
