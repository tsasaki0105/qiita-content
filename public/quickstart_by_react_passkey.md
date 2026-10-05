---
title: 【Auth0で学ぶ認証強化】Auth0公式ReactクイックスタートにPasskeyログインを追加してみた（1/2）
tags:
  - 認証
  - Auth0
  - React
  - passkey
  - idaas
private: false
updated_at: '2026-09-30T16:36:56+09:00'
id: c690767603a413e4d45f
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
# はじめに

前回、[Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた](https://qiita.com/tsasaki0105/items/50787a005dce9ec5b4ef)という記事で、Reactアプリに「ログイン」「ログアウト」「ユーザー情報表示」を組み込みました。

今回はその続きとして、**「ログイン強化編」全2回**の1回目、**Passkey（パスキー）** を使ったログインを追加してみます。2回目では[MFA（多要素認証）](https://qiita.com/tsasaki0105/items/2eb7680dd1f5be8ebc34)を追加する予定です。

Passkeyは、パスワードの代わりにデバイスの生体認証（指紋・顔認証）やPINでログインできる仕組みです。フィッシングに強く、パスワードを覚える・管理する必要がなくなるのが最大のメリットです。

Auth0では、Passkeyの有効化は**ダッシュボードの設定のみ**で完了し、前回作ったReactアプリのコードは一切変更しません。「Passkey実装して」と言われて身構える必要がないことを、実際に手を動かして確認してみます。

※こちらの手順は2026年09月時点のものとなります。

---

# 事前準備

* 前回作成したReactアプリ（`auth0-react-quickstart`）
* Auth0のテナント環境（[無料トライアル](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)で作成可能です）
* Passkeyを試すためのデバイス（Windows Helloや、MacのTouch ID/Face IDなど生体認証に対応した環境を推奨します）

---

# 1. Auth0ダッシュボードでPasskeyを有効化する

1. Auth0ダッシュボードの左メニューから **「認証」→「データベース」** を選択し、前回のアプリで使用しているデータベース接続（デフォルトでは **`Username-Password-Authentication`**）をクリックします。

    ![データベース接続](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/5b5b20f0-e939-4766-80ab-c0f64ff33706.png)

2. データベース接続の **認証方法タブ** にある **パスキーの「構成」** を選択します。

    ![パスキーの構成](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/95dbdaba-cbc7-463b-8aa0-2ee101ee41f6.png)

3. **「パスキーを有効化」** のチェックボックスをONにします。また、その下にある **パスキー認証の前提条件** を全て完了させます。

    ![パスキーの有効化](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/c2531bbf-23f1-4458-a6cf-90cf1fcbc959.png)

4. 画面下部の **「保存」** をクリックします。

これでAuth0側の設定は完了です。Reactアプリ側のコードは前回のまま、何も変更していません。

---

# 2. 実際に動かしてみる

前回作成したReactアプリをそのまま起動します。

```bash
npm run dev
```

1. `http://localhost:5173` にアクセスし、 **「Log In」** をクリックしてユニバーサルログイン画面を表示します。

    ![login](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/11d765dc-9fb2-4671-8511-8f4dd749e48c.png)

2. 既存アカウントでログイン、またはサインアップします。ログインに成功すると、ユニバーサルログイン画面上で **「このデバイス上でReact App用にパスキーを作成」** といった案内が表示されます。

    ![パスキー登録](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/efa4f776-340f-432c-9cab-ef8bca61a7bc.png)

3. 案内に従って登録を進めると、OS標準の生体認証（Touch ID / Windows Helloなど）のダイアログが表示されます。指紋や顔認証を行うと、パスキーの登録が完了します。

    ![パスキー登録2](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/e3f0d7bb-1bac-47ce-a36d-1415a22a2471.png)

4. 登録後は前回と同じく、ユーザーのアイコン・名前・メールアドレスと **「Log Out」** ボタンが表示されたアプリ画面に遷移します。ここまではコード上の見た目に変化はありません。

    ![ログイン後](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/038602c1-b37b-4de1-b520-08dc4cc477ef.png)

5. **「Log Out」** で一度サインアウトし、再度 **「Log In」** をクリックします。今度はメールアドレス/パスワードの入力を求められず、デバイスの生体認証だけでログインが完了することを確認できます。

    ![パスキーログイン](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/f13e73e5-b47e-4ad9-9bd3-129c59455bcf.png)
    ※参考画像はパスキーの保存先に1Passwordを利用している画面となります。

パスワードを一切入力せずにログインが完了しました。Reactアプリ側のコードは前回から1行も変えていません。

---

# まとめ

Auth0公式Quickstartで作ったReactアプリに、Passkeyログインを追加してみました。

* Passkeyの有効化はAuth0ダッシュボードの設定のみで完了し、アプリ側のコード変更は不要
* ユニバーサルログインが登録・ログインのUIを丸ごと提供してくれるため、WebAuthnの実装を自分で書く必要がない
* 一度登録すれば、パスワード入力なしで生体認証だけでログインできる

次回は「ログイン強化編」の2回目として、**MFA（多要素認証）** を同じReactアプリに追加してみます。

# 参考

* [Auth0 Passkeys（公式ドキュメント）](https://auth0.com/docs/authenticate/database-connections/passkeys)
* [Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた](https://qiita.com/tsasaki0105/items/50787a005dce9ec5b4ef)
* [22日間多くの機能が無料！Auth0で最新の認証基盤を今すぐ始める方法](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)
