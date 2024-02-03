import React, { useEffect } from "react";
import "./login.css";

const Login = () => {
  useEffect(() => {
    // Function to extract and display the alert message
    const displayAlert = () => {
      const alertMessage = new URLSearchParams(window.location.search).get(
        "alert"
      );
      if (alertMessage) {
        alert(decodeURIComponent(alertMessage));
      }
    };

    // Call the displayAlert function when the component mounts
    displayAlert();
  }, []);
  const loginwithgoogle = () => {
    window.open("http://localhost:8080/auth/google/callback", "_self");
  };

  return (
    <>
      <div className="split left1"></div>
      <div className="split right1">
        <div className="pap">
          <h1>Welcome Students</h1>
          <p>
            Say goodbye to the hassle of selling your items because, at
            BuyNSellHub, we've made it as easy as " 📸 Snap, List, and Go!":
          </p>
          <p>
            Simply snap a photo, add a catchy description, set your price, and
            there you Go! Your item is ready to find a new home!!!
          </p>
          <button className="login-with-google-btn" onClick={loginwithgoogle}>
            SIGN IN WITH GOOGLE
          </button>
        </div>
      </div>
    </>
  );
};
export default Login;
