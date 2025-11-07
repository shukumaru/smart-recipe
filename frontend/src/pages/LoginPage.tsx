import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RecipePage.module.css'; // Re-using some styles for consistency

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginError = () => {
    console.error("Login Failed");
    alert("ログインに失敗しました。時間をおいて再度お試しください。");
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Send the authorization code to the backend
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/google/login`,
          { code: codeResponse.code },
          { withCredentials: true }, // Important for cookie exchange
        );
        onLoginSuccess();
        navigate("/"); // Redirect to home page on successful login
      } catch (error) {
        console.error("Failed to exchange code for token", error);
        alert("サーバーとの認証に失敗しました。");
      }
    },
    onError: handleLoginError,
    flow: 'auth-code', // This is crucial for getting the authorization code
  });

  return (
    <div
      className={styles.container}
      style={{ textAlign: 'center', paddingTop: '100px' }}
    >
      <h1 className={styles.title}>レシピサポートくんへようこそ</h1>
      <img
        src="/top_picture.png"
        alt="top picture"
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '15px auto',
          marginTop: '-40px',
        }}
      />
      <p className={styles.subtitle}>
        続けるにはGoogleアカウントでログインしてください。
      </p>
      <button className="google-login-button" onClick={() => login()}>
        <img src="/google-logo.svg" alt="Google logo" />
        <span>Googleでログイン</span>
      </button>
    </div>
  );
};

export default LoginPage;
