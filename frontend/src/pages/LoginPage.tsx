import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styles from "./RecipePage.module.css"; // Re-using some styles for consistency

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (token) {
      onLoginSuccess(token);
      navigate("/"); // Redirect to home page on successful login
    }
  };

  const handleLoginError = () => {
    console.error("Login Failed");
    alert("ログインに失敗しました。時間をおいて再度お試しください。");
  };

  return (
    <div
      className={styles.container}
      style={{ textAlign: "center", paddingTop: "100px" }}
    >
      <h1 className={styles.title}>レシピサポートくんへようこそ</h1>
      <img
        src="/top_picture.png"
        alt="top picture"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "15px auto",
          marginTop: "-40px",
        }}
      />
      <p className={styles.subtitle}>
        続けるにはGoogleアカウントでログインしてください。
      </p>
      <div style={{ margin: "15px auto" }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          type="standard"
          text="signin_with"
          shape="pill"
          theme="outline"
          size="large"
        />
      </div>
    </div>
  );
};

export default LoginPage;
