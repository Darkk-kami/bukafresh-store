import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import React from "react";
// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="12345"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);


