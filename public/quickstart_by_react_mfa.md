---
title: 【Auth0で学ぶ認証強化】Auth0公式ReactクイックスタートにMFA（多要素認証）を追加してみた（2/2）
tags:
  - 認証
  - Auth0
  - React
  - MFA
  - idaas
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: true
---
# はじめに

前回、[Auth0公式ReactクイックスタートにPasskeyログインを追加してみた](https://qiita.com/tsasaki0105/items/50787a005dce9ec5b4ef)という記事で、「ログイン強化編」の1回目としてPasskeyを追加しました。

今回は **「ログイン強化編」全2回** の2回目 、 **MFA（多要素認証）** を同じReactアプリに追加してみます。

MFA（Multi-Factor Authentication）は、パスワードなどの「知っている情報」に加えて、TOTPアプリのワンタイムコードや生体認証といった「もう一つの要素」を組み合わせてログインを検証する仕組みです。仮にパスワードが漏洩しても、もう一つの要素がなければログインできないため、不正アクセスのリスクを大きく下げられます。

Passkeyのときと同様、MFAもAuth0では**ダッシュボードの設定のみ**で有効化でき、Reactアプリ側のコードは変更しません。

※こちらの手順は2026年08月時点のものとなります。

---

# 事前準備

* 前回・前々回で作成したReactアプリ（`auth0-react-quickstart`）
* Auth0のテナント環境（[無料トライアル](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)で作成可能です）
* TOTP（ワンタイムパスワード）を発行できるアプリ（Google AuthenticatorやAuthyなど）

---

# 1. Auth0ダッシュボードでMFAを有効化する

1. Auth0ダッシュボードの左メニューから **「セキュリティ」→「多要素認証」** を選択します。

<!-- 📸 TODO: スクリーンショット（多要素認証の設定画面） -->

2. 利用可能な要素（ファクター）の一覧が表示されます。今回は最も手軽に試せる **「ワンタイムパスワード」（TOTP）** をクリックし、トグルを **ON** にします。

<!-- 📸 TODO: スクリーンショット（ワンタイムパスワード要素の有効化） -->

   ※SMSやメール、プッシュ通知（Guardianアプリ）、WebAuthnなど他の要素も同じ画面から有効化できます。

3. 画面下部の **「定義」（ポリシー）** で、MFAを要求するタイミングを選択します。今回は動作確認をしやすくするため、 **「常に要求する」** を選択します。

<!-- 📸 TODO: スクリーンショット（MFAポリシーの選択） -->

   ※本番環境では、ログインごとのリスクスコアに応じてMFAを要求する **「適応型MFA」** を使うことで、ユーザー体験とセキュリティのバランスを取ることもできます。

4. 設定を保存します。

これでAuth0側の設定は完了です。Reactアプリ側のコードは前回・前々回のまま、何も変更していません。

---

# 2. 実際に動かしてみる

前回までに作成したReactアプリをそのまま起動します。

```bash
npm run dev
```

1. `http://localhost:5173` にアクセスし、 **「Log In」** をクリックしてユニバーサルログイン画面を表示します。

2. メールアドレス/パスワード（またはPasskey）でログインします。ポリシーを「常に要求する」に設定したため、認証情報の確認後、続けて **MFAの設定画面** が表示されます。

<!-- 📸 TODO: スクリーンショット（MFA要素の選択画面） -->

3. **「ワンタイムパスワード」** を選択すると、QRコードが表示されます。Google AuthenticatorやAuthyでQRコードを読み取り、アプリに表示された6桁のコードを入力します。

<!-- 📸 TODO: スクリーンショット（QRコードと認証コード入力画面） -->

4. コードが正しく認証されると、前回までと同様にユーザーのアイコン・名前・メールアドレスと **「Log Out」** ボタンが表示されたアプリ画面に遷移します。

5. **「Log Out」** で一度サインアウトし、再度 **「Log In」** をクリックします。今度は認証情報の入力後、登録済みのTOTPアプリで生成したコードの入力を求められることを確認できます。

<!-- 📸 TODO: スクリーンショット（2回目ログイン時のMFAコード入力画面） -->

パスワード（またはPasskey）に加えて、もう一つの要素の確認が必須になりました。Reactアプリ側のコードは一切変更していません。

---

# 3. （参考）特定の操作だけMFAを要求したい場合

今回はログインのたびにMFAを要求する設定にしましたが、実際のアプリでは「決済処理の前だけMFAを要求する」といった**ステップアップ認証**もよく使われます。

これは認可リクエストに `acr_values=http://schemas.openid.net/pape/policies/2007/06/multi-factor` パラメータを付与し、IDトークンに含まれる `amr` クレームでMFA実施済みかどうかを判定する仕組みです。今回は掘り込みませんが、興味のある方はAuth0公式のステップアップ認証ドキュメントをご参照ください。

---

# まとめ

Auth0公式Quickstartで作ったReactアプリに、MFA（多要素認証）を追加してみました。

* MFAの有効化はAuth0ダッシュボードの設定のみで完了し、アプリ側のコード変更は不要
* ユニバーサルログインがMFAの登録・検証UIを丸ごと提供してくれるため、TOTPやWebAuthnの実装を自分で書く必要がない
* ポリシーを変えることで「常に要求」「適応型」など運用に合わせた強度に調整できる

これで「ログイン強化編」の全2回（Passkey・MFA）は完了です。次回は、この認証基盤を実際のAPI呼び出しに活かす **「アクセストークンを使ったAPI認可編」** に挑戦してみたいと思います。

# 参考

* [Auth0 Multi-factor Authentication（公式ドキュメント）](https://auth0.com/docs/secure/multi-factor-authentication)
* [Step-Up Authentication（公式ドキュメント）](https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication)
* [Auth0公式ReactクイックスタートにPasskeyログインを追加してみた](https://qiita.com/tsasaki0105/items/xxxxxxxxxxxxxxxxxxxx)
* [Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた](https://qiita.com/tsasaki0105/items/50787a005dce9ec5b4ef)
* [22日間多くの機能が無料！Auth0で最新の認証基盤を今すぐ始める方法](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)
