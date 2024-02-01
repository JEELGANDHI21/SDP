import React, {useEffect}from "react";
import "./login.css";

const Login = () => {
  useEffect(() => {
    // Function to extract and display the alert message
    const displayAlert = () => {
      const alertMessage = new URLSearchParams(window.location.search).get("alert");
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
    <div className="login-page">
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <div className="form">
        <button className="login-with-google-btn" onClick={loginwithgoogle}>
          SIGN IN WITH GOOGLE
        </button>
      </div>
    </div>
  );
};
export default Login;
