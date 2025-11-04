# 献立生成アプリ スマートレシピくん

このアプリケーションは、Gemini APIを活用して日々の献立を提案するWebアプリケーションです。

## 概要

- **フロントエンド**: ユーザーが操作するインターフェースを提供します。食材や希望の料理の種類などを入力すると、バックエンドにリクエストを送信し、結果を表示します。
- **バックエンド**: フロントエンドからのリクエストを受け取り、Gemini APIと通信して献立を生成します。生成された献立をフロントエンドに返却します。

## 技術スタック

- **フロントエンド**:
  - React
  - TypeScript
  - Vite
- **バックエンド**:
  - NestJS
  - TypeScript

## ディレクトリ構成

- `frontend/`: フロントエンドのソースコードが格納されています。
- `backend/`: バックエンドのソースコードが格納されています。

## 環境構築と実行方法

### バックエンド

1.  **ディレクトリ移動**:
    ```bash
    cd backend
    ```

2.  **パッケージのインストール**:
    ```bash
    npm install
    ```

3.  **環境変数の設定**:
    `backend`ディレクトリの直下に`.env`ファイルを作成し、ご自身のGemini APIキー,GoogleOAuth2.0クライアントIDを設定してください。

    ```
    API_KEY=YOUR_GEMINI_API_KEY
    VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    ```
    ※ APIキーは[Google AI for Developers](https://ai.google.dev/)などから取得してください。
    ※ GoogleOAuth2.0クライアントIDは[Google Cloud Console](https://console.cloud.google.com/)から取得してください。

4.  **開発サーバーの起動**:
    ```bash
    npm run start:dev
    ```
    サーバーが `http://localhost:3000` で起動します。

### フロントエンド

1.  **ディレクトリ移動**:
    ```bash
    cd frontend
    ```

2.  **パッケージのインストール**:
    ```bash
    npm install
    ```

3.  **環境変数の設定**:
    `frontend`ディレクトリの直下に`.env`ファイルを作成し、ご自身のGoogleOAuth2.0クライアントIDを設定してください。

    ```
    VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    ```

4.  **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    開発サーバーが起動し、ブラウザでアクセスするためのURLが表示されます（例: `http://localhost:5173`）。
