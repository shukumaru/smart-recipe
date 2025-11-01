import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      TODO: Replace with your actual Google Client ID
      You can get it from the Google Cloud Console: https://console.cloud.google.com/apis/credentials
    */}
    <GoogleOAuthProvider clientId="143242869279-ld2vc4b1sp8pll96h2i5reqv311nf3h8.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
