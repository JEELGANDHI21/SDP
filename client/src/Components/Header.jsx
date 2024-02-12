import React, { useEffect, useState } from "react";
import "./header.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Headers = () => {
  const [userdata, setUserdata] = useState({});
  console.log("response", userdata);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/sucess", {
        withCredentials: true,
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
    <>
      <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
        <nav>
          <div className="left flex items-center">
            <h1 className="text-white text-2xl font-bold">BuyNSellHub</h1>
          </div>
          <div className="right flex items-center space-x-6">
            <ul className="hidden md:flex">
              {Object?.keys(userdata)?.length > 0 ? (
                <>
                  <li>
                    <NavLink to="/home">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/">Logout</NavLink>
                    {/* <li onClick={logout}>Logout</li> */}
                  </li>
                  <li>
                    <img
                      src={userdata?.image}
                      style={{ width: "50px", borderRadius: "50%" }}
                      alt=""
                    />
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Headers;
