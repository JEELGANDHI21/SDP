import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav className="bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <a className="text-lg font-bold" href="#">Admin Dashboard</a>
                        </div>
                        <div>
                            <ul className="flex space-x-4">
                                <li>
                                    <NavLink className="text-gray-800 hover:text-gray-600" to={"/home"}>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink className="text-gray-800 hover:text-gray-600" to={"/users"}>Users</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/productlist"} className="text-gray-800 hover:text-gray-600" >Products</NavLink>
                                </li>
                                <li>
                                    <NavLink className="text-gray-800 hover:text-gray-600" to={"/soldproduct"}>Sold Products</NavLink>
                                </li>
                                
                            </ul>
                        </div>
                        <div>
                            <form className="flex items-center">
                                <input className="border border-gray-300 rounded-lg py-2 px-4 mr-2 focus:outline-none" type="search" placeholder="Search" aria-label="Search" />
                                <button className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 focus:outline-none" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
