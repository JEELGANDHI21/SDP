import React from "react";
import "./header.css";
import { NavLink } from "react-router-dom";

import { useSelector } from "react-redux";

const Headers = () => {
  const user = useSelector((state) => state.user);
  console.log("Header ", user);

  return (
    <>
      <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
        <nav>
          <div className="left flex items-center">
            <h1 className="text-white text-2xl font-bold">BuyNSellHub</h1>
          </div>
          <div className="right flex items-center space-x-6">
            <ul className="hidden md:flex">
              {Object?.keys(user)?.length > 0 ? (
                <>
                  <li>
                    <NavLink to="/home">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/">Logout</NavLink>
                    {/* <li onClick={logout}>Logout</li> */}
                  </li>
                  <li>
                    <a href="/user-profile">
                      <img
                        src={user?.image}
                        style={{ width: "50px", borderRadius: "50%" }}
                        alt=""
                      />
                    </a>
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
