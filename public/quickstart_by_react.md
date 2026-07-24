---
title: Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた
tags:
  - 認証
  - Auth0
  - React
  - 初学者向け
  - idaas
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
# はじめに

少し間隔が空いてしまいましたが、[「認証、マジで意味わからん」と思っていた新入社員SEが、Auth0に救われた話](https://qiita.com/tsasaki0105/items/8067d1dec8c8c0bb72ae)という記事で「次回は実際にAuth0を使ってみるクイックスタートをご紹介します！」とお伝えしていました。

今回はその宣言通り、Auth0公式が提供する[React (SPA) Quickstart](https://auth0.com/docs/quickstart/spa/react)を実際に手元で試してみます。

Reactで作ったSPA（Single Page Application）に、Auth0の認証機能（ログイン・ログアウト・ユーザー情報の取得）をどのくらい簡単に組み込めるのか、公式ドキュメント通りに手順を進めながら検証していきます。

このハンズオンを完了すると、Reactアプリに「ログイン」「ログアウト」「ログイン中のユーザー情報表示」を実装した状態になります。

※こちらの手順は2026年07月時点のものとなります。

---

# 事前準備

今回使用する環境・ツールは以下の通りです。

* Node.js / npm（インストール済みであることを前提とします）
* [Vite](https://vitejs.dev/)（Reactアプリの雛形作成に使用）
* Auth0のアカウント（[無料トライアル](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)で作成可能です）

---

# 1. Auth0ダッシュボードでアプリケーションを作成する

まずはAuth0側で、今回作成するSPA用の「アプリケーション」を登録します。

1. Auth0ダッシュボードにログインし、左メニューの **「アプリケーション」** から **「アプリケーション」** を選択し、 **「＋ アプリケーションを作成」** をクリックします。
　
![Application作成](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/dfaf21a1-f6a5-48f9-b8b5-cdef56777329.png)
　

2. アプリケーション名を入力し、種別として **「シングルページWebアプリケーション」** を選択、 **「作成」** をクリックします。
　
![アプリケーション種別の選択](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/868455ab-2dc6-489b-87e8-87d5683cfdf9.png)
　

3. 作成が完了すると **「設定」** タブに **ドメイン** と **クライアントID** が表示されます。この2つの値は、後ほどReact側の実装で使用します。
　
![DomainとClientID](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/6c6fb148-e59c-4b7e-a8ab-7b9d6021dfd6.png)
　

4. 同じ **「設定」** タブ内にある以下3つの項目に、ローカルの開発サーバーURL（今回は `http://localhost:5173`）を設定し、画面下部の **「保存」** をクリックします。

   * **許可するCallback　URL**
   * **許可するログアウトURL**
   * **許可するWebオリジン**

　
![コールバックURLの設定](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/c8369291-7b9a-4646-8511-c7d9ad1f37d8.png)
　

これでAuth0側の準備は完了です。

---

# 2. Viteで React アプリの雛形を作成する

続いて、認証を組み込む対象となるReactアプリを作成します。

1. 作業用のディレクトリで以下のコマンドを実行し、Reactの雛形を作成します。

   ```bash
   npm create vite@latest auth0-react-quickstart -- --template react
   cd auth0-react-quickstart
   npm install
   ```
   　

2. 動作確認のため、一度開発サーバーを起動しておきます。

   ```bash
   npm run dev
   ```
  　

`http://localhost:5173` にアクセスし、Viteのデフォルト画面が表示されればOKです。

---

# 3. Auth0 React SDKを組み込む

ここからが本題です。公式Quickstartの手順に沿って、`@auth0/auth0-react` をインストールし、アプリに認証機能を組み込みます。

1. SDKをインストールします。

   ```bash
   npm install @auth0/auth0-react
   ```
   　

2. プロジェクトルートに `.env` ファイルを作成し、手順1で確認した **ドメイン** と **クライアントID** を設定します。Viteの環境変数は `VITE_` から始まる名前で定義する必要があります。

   ```.env
   VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   ```

   `.env` には認証情報が含まれるため、`.gitignore` に追加してリポジトリに含めないようにしておきましょう。
   　

3. `src/main.jsx` を編集し、アプリ全体を `Auth0Provider` でラップします。

   ```jsx:src/main.jsx
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import { Auth0Provider } from '@auth0/auth0-react'
   import './index.css'
   import App from './App.jsx'

   createRoot(document.getElementById('root')).render(
     <StrictMode>
       <Auth0Provider
         domain={import.meta.env.VITE_AUTH0_DOMAIN}
         clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
         authorizationParams={{
           redirect_uri: window.location.origin,
         }}
       >
         <App />
       </Auth0Provider>
     </StrictMode>,
   )
   ```
   　

4. `src/App.jsx` を編集し、`useAuth0` フックを使ってログイン・ログアウト・ユーザー情報表示のコンポーネントを実装します。

   ```jsx:src/App.jsx
   import { useAuth0 } from '@auth0/auth0-react'
   import './App.css'

   function LoginButton() {
     const { loginWithRedirect } = useAuth0()
     return <button onClick={() => loginWithRedirect()}>Log In</button>
   }

   function LogoutButton() {
     const { logout } = useAuth0()
     return (
       <button
         onClick={() =>
           logout({ logoutParams: { returnTo: window.location.origin } })
         }
       >
         Log Out
       </button>
     )
   }

   function Profile() {
     const { user } = useAuth0()
     return (
       <div>
         <img src={user.picture} alt={user.name} width="80" />
         <h2>{user.name}</h2>
         <p>{user.email}</p>
       </div>
     )
   }

   function App() {
     const { isLoading, isAuthenticated } = useAuth0()

     if (isLoading) {
       return <div>Loading...</div>
     }

     return (
       <section id="center">
         <h1>Auth0 React Quickstart</h1>
         {isAuthenticated ? (
           <>
             <Profile />
             <LogoutButton />
           </>
         ) : (
           <LoginButton />
         )}
       </section>
     )
   }

   export default App
   ```
   　

コード自体は非常にシンプルで、`useAuth0()` から取り出せる `loginWithRedirect`・`logout`・`isAuthenticated`・`user` の4つを使うだけで、認証状態に応じたUIの切り替えが実現できています。

---

# 4. 実際に動かしてみる

実装が終わったら、開発サーバーを起動して動作を確認します。

```bash
npm run dev
```

1. `http://localhost:5173` にアクセスすると、未ログイン状態なので **「Log In」** ボタンが表示されます。

   ![未ログイン画面](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/62771b32-662b-4647-b2ee-cc0a12d96fad.png)
   　

2. **「Log In」** をクリックすると、Auth0のユニバーサルログイン画面にリダイレクトされます。画面のデザインや項目（メール/パスワード、ソーシャルログインなど）はアプリ側で一切実装していません。Auth0が提供するログイン画面がそのまま表示されています。

   ![ユニバーサルログイン画面](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/c49c0f57-9d94-44cc-8e2f-da781da2c78b.png)

   ※アカウントを持っていない場合は、画面下部の **「サインアップ」** リンクから新規作成できます。アカウント作成が完了すると、そのまま自動でログイン状態となりアプリにリダイレクトされます。
   　

3. ログインに成功すると、アプリに自動でリダイレクトされ、ログイン中のユーザーのアイコン・名前・メールアドレスと **「Log Out」** ボタンが表示されました。

   ![ログイン後の画面](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/4ad00816-106b-4cab-91f9-6305bdcb2028.png)
   　

4. **「Log Out」** をクリックすると、セッションが破棄され、手順1の未ログイン画面に戻ります。
　

ログイン・ログアウト・ユーザー情報の取得まで、コードを数十行書くだけで一通り動作することが確認できました。

---

# まとめ

実際にAuth0公式のReact Quickstartを手元で試してみたところ、以下のことが確認できました。

* `@auth0/auth0-react` をインストールし、`Auth0Provider` でアプリをラップするだけで認証の土台が整う
* ログイン画面はAuth0のユニバーサルログインがそのまま使えるため、自前でUIを実装する必要がない
* `useAuth0()` フックから取得できる状態・関数だけで、ログイン/ログアウト/ユーザー情報表示が実装できる

前回の記事で紹介した「認証のハードルの高さ」を、Reactのプロジェクトでも体感として下げられることが分かりました。今後は、APIへのアクセストークン付与や、MFA・Passkeyなどより実践的なトピックにも挑戦してみたいと思います。

# 参考

* [Auth0 React SDK Quickstart（公式）](https://auth0.com/docs/quickstart/spa/react)
* [auth0-react（GitHub）](https://github.com/auth0/auth0-react)
* [「認証、マジで意味わからん」と思っていた新入社員SEが、Auth0に救われた話](https://qiita.com/tsasaki0105/items/8067d1dec8c8c0bb72ae)
* [22日間多くの機能が無料！Auth0で最新の認証基盤を今すぐ始める方法](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)