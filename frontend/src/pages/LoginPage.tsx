import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import styles from './RecipePage.module.css'; // Re-using some styles for consistency

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (token) {
      onLoginSuccess(token);
      navigate('/'); // Redirect to home page on successful login
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    alert('ログインに失敗しました。時間をおいて再度お試しください。');
  };

  return (
    <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 className={styles.title}>スマートレシピくんへようこそ</h1>
      <p className={styles.subtitle}>続けるにはGoogleアカウントでログインしてください。</p>
      <div style={{ marginTop: '40px' }}>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      </div>
    </div>
  );
};

export default LoginPage;
