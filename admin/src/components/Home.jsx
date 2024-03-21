import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="flex h-screen">
            {/* Left side with image */}
            <div className="flex-1 flex items-center justify-center bg-gray-200">
                <img src="https://buynsellhub.s3.ap-south-1.amazonaws.com/Food/WhatsApp+Image+2024-02-03+at+00.34.53_7c58aaf8.jpg" alt="Image" className="w-auto h-full object-left" />
            </div>
            {/* Right side with description */}
            <div className="flex-1 flex items-center justify-center bg-black text-white">
                <div className="max-w-md p-8">
                    <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
                    <p className="text-lg mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum odio id varius luctus.</p>
                    <Link to="/productlist" className="text-blue-500 hover:underline mr-4">Product List</Link>
                    <Link to="/users" className="text-blue-500 hover:underline">Users</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
