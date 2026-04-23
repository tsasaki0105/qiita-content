---
title: （仮）無料トライアル環境ではじめる Auth0ハンズオン
tags:
  - 'Auth0'
  - 'idaas'
  - '初学者向け'
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: true
---
# はじめに

Okta JapanでAuth0のソリューションエンジニア（SE）をしている者です。

前回、[「認証、マジで意味わからん」と思っていた新入社員SEが、Auth0に救われた話](https://qiita.com/tsasaki0105/items/8067d1dec8c8c0bb72ae)という記事を投稿させていただきました。

今回は、 **「Auth0の無料トライアル環境を作って、実際にログイン機能を動かしてみる」** という実践的なハンズオンをお届けします。

このハンズオンを完了すると、シングルページアプリケーション（SPA）にAuth0のログイン機能を組み込むことができるようになります。

---

# 1. Auth0 無料トライアル環境の取得手順 (2026年5月時点)

* 1-1 [Auth0の公式ホームページ](https://auth0.com/jp/signup)にアクセスします。

* 1-2 メールアドレスを入力し、サインアップします。
※仕事用のメールアドレス（フリーアドレス以外）でないとエラーが発生します。

![signup](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/59e6e3d1-8278-4d21-a631-c59d943e57b5.png)

* 1-3 **「登録」** を押下した後、次のような画面にリダイレクトされます。

![image-1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/75f91af4-89fa-4f7c-a6a2-c27ea591468c.png)

* 1-4 **「続ける」** を押下した後、1-2で入力したメールアドレスに本人確認のためのコードが送信されます。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/e5014280-6eac-4fea-bdec-6b356c4a95bd.png)

* 1-5 メールアドレスに届いたコードを入力し、 **「続ける」** を押下します。

![image-2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/c4897269-baaa-43ae-bfaa-e5d80c9f6d83.png)

* 1-6 本人確認完了後、Auth0アカウントのパスワードを設定します。

![image-3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/403d53c4-23e8-499f-89eb-91eed9bc8eaf.png)

---

# 2. Auth0 Dashboardへアクセスする

Auth0 Dashboardとは、Auth0の **サブスクリプションと構成に関するあらゆる側面を管理する** 場所です。

---

# 3. ユニバーサルログインを動かしてみる

ユニバーサルログインとは、 **中央認証サーバー経由でユーザーを認証する仕組み** です。ユニバーサルログインを活用することで、 **Passkeyなどの最新の認証方式への対応** や **ブルートフォース攻撃などのセキュリティ対策** を簡単に有効化することができます。

---

# 4. おわりに

いかがでしょうか？
今回のハンズオンを通じて、 **いかに簡単にかつ安全** にAuth0のログイン機能をアプリケーションに組み込むことができるかが体験いただけたかと思います。
次回は、このハンズオンで作成した環境に **ソーシャルログイン** を実装していきます！

---
