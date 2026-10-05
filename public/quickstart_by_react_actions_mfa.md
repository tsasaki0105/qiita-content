---
title: 【Auth0で学ぶ認証強化】Auth0 ActionsでMFAを出し分ける（Passkeyならノーパス、ID/パスワードならMFA要求）
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
ignorePublish: false
---
# はじめに

前回、[Auth0公式ReactクイックスタートにMFA（多要素認証）を追加してみた](https://qiita.com/tsasaki0105/items/2eb7680dd1f5be8ebc34)という記事で、「ログイン強化編」の2回目として、ログインのたびに常にMFAを要求する設定を試しました。

ただ、実際のサービスでは「全ユーザーに常にMFAを要求する」のはやや過剰で、ユーザー体験を損ねがちです。特に、[前々回](https://qiita.com/tsasaki0105/items/c690767603a413e4d45f)で追加したPasskeyは、生体認証とデバイス固有の鍵ペアによってフィッシング耐性を備えた認証方式であり、それ自体がすでに「もう一つの要素」に相当するとも言えます。

そこで今回は、**Auth0 Actions** を使って、ログイン方法に応じてMFAの要求を出し分けてみます。具体的には、

* **Passkeyでログインした場合** → MFAをスキップ（ノーパス）
* **ID/パスワードでログインした場合** → MFAを要求

という条件分岐を実装します。これは認証後に実行されるAction（Post-Loginトリガー）の中で、「どの認証方法でログインしたか」というコンテキストを使って認可（＝MFAを要求するかどうか）を動的に決める、という意味で一種の**API認可**的な制御とも言えます。Auth0公式でも[「Reduce friction with passkeys」](https://auth0.com/docs/customize/actions/explore-triggers/post-login#reduce-friction-with-passkeys)というユースケースとして紹介されているパターンです。

※こちらの手順は2026年10月時点のものとなります。

---

# 事前準備

* 前回・前々回で作成したReactアプリ（`auth0-react-quickstart`）
* Passkeyが有効化されたAuth0のデータベース接続（[前々回の記事](https://qiita.com/tsasaki0105/items/c690767603a413e4d45f)参照）
* MFA（TOTPなど）が有効化されたAuth0テナント（[前回の記事](https://qiita.com/tsasaki0105/items/2eb7680dd1f5be8ebc34)参照）

今回はダッシュボードの設定だけでなく、初めて**Actions**（JavaScriptコード）を書きます。

---

# 1. 「Customize MFA Factors using Actions」を有効化する

Actionsから `api.multifactor.enable` / `api.multifactor.enable("none")` を呼び出してMFAの要求を制御するには、まずこの機能をダッシュボード側で有効にしておく必要があります。

1. Auth0ダッシュボードの左メニューから **「セキュリティ」→「多要素認証」** を選択します。
  ![多要素認証](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/d1e2fbd0-2824-47d5-a3a2-188acc7886b3.png)
　
2. 画面下部の **「追加設定」** を開き、**「ActionsでMFA要素をカスタマイズする」** のトグルを **ON** にします。
  ![追加設定](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/5e20f48f-c280-4d44-b62b-38543ec0c198.png)

これで、Actions側からMFAの要求有無をコントロールできるようになりました。

---

# 2. Actionを作成する

1. Auth0ダッシュボードの左メニューから **「アクション」→「ライブラリー」** を選択します。その後、**カスタム**タブの **「アクションの作成」** をクリックします。
  ![アクションの作成](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/b0fe0c17-5a7a-4110-942e-4d9fe2ea716d.png)

2. **初めから構築する** を選択し、適当な名前（例: `skip-mfa-for-passkey`）、トリガーは **「Login / Post Login」** を選択し、ランタイムは**Node 22** を選択して作成します。
  ![設定](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/ba6b4848-c2e8-4224-a395-d729bd7443ae.png)

3. エディタに以下のコードを記述します。

   ```javascript
   /**
    * @param {Event} event - ログインしたユーザーとコンテキストの情報
    * @param {PostLoginAPI} api - ログイン後の挙動を変更するためのAPI
    */
   exports.onExecutePostLogin = async (event, api) => {
     // 今回の認証でPasskeyが使われたかどうかを判定する
     const usedPasskey = event.authentication?.methods.some(
       (method) => method.name === "passkey"
     );

     // Passkeyでログインしていた場合はMFAをスキップする
     if (usedPasskey) {
       api.multifactor.enable("none");
     }

     // ID/パスワードなど他の方法でログインした場合は何もしない
     // → テナントに設定済みの「常時MFA」ポリシーがそのまま適用される
   };
   ```

   `event.authentication.methods` には、今回のログインで使われた認証方法の履行履歴が配列で入っています。`name` が `"passkey"` であれば、Passkeyでログインしたことがわかります。Passkeyが使われていた場合のみ `api.multifactor.enable("none")` を呼び、MFAを明示的にスキップします。ID/パスワードでログインした場合はこのActionは何もしないため、前回設定した「常時MFAを要求する」ポリシーがそのまま有効になります。

4. 右上の **「デプロイ」** をクリックして保存します。
  ![デプロイ](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/3901845d-402d-4eb4-8ca6-d03c66bcc39f.png)

5. Auth0ダッシュボードの左メニューから **「アクション」→「トリガー」→「サインアップとログイン」→「post-login」** を選択します。
  ![トリガー選択](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/ac5fde1c-b789-493d-ad2e-ad171b08e70e.png)

6. 作成したActionをフロー図の **開始** と **完了** の間の位置にドラッグ＆ドロップして追加し、**「適用」** をクリックします。
  ![フロー設定](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/f6103e26-9d92-47ac-aff2-4507f3f1f034.png)

これでログインの度に、このActionが実行されるようになりました。

---

# 3. 実際に動かしてみる

前回までに作成したReactアプリをそのまま起動します。

```bash
npm run dev
```

### パターンA: Passkeyでログイン（MFAスキップを確認）

1. `http://localhost:5173` にアクセスし、 **「Log In」** をクリックします。
  ![login](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/11d765dc-9fb2-4671-8511-8f4dd749e48c.png)

2. Passkey登録済みのアカウントで、デバイスの生体認証（Touch ID / Windows Helloなど）でログインします。
  ![passkey-login](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/a2188146-a31e-4ab1-a381-0207859b907e.png)

3. **MFAの入力画面は表示されず**、そのままアプリ画面（ユーザー情報と「Log Out」ボタン）に遷移することを確認します。
  ![logout](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/ec0bd8b5-67c6-4db7-8e09-b64c21710df8.png)

### パターンB: ID/パスワードでログイン（MFA要求を確認）

1. 一度ログアウトし、再度 **「Log In」** をクリックします。
  ![login](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/11d765dc-9fb2-4671-8511-8f4dd749e48c.png)

2. 今度はメールアドレス/パスワードを入力してログインします（Passkeyのプロンプトが出た場合はスキップ、またはPasskey未登録の別アカウントを使用します）。
  ![ID/PW](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/91a00c97-71c4-4eda-9c59-33c0609f3df7.png)

3. 前回同様、 **TOTPアプリのコード入力画面が表示される** ことを確認します。コードを入力してログインを完了します。
  ![mfa](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4409088/c97fde0e-12fe-4333-82b7-cec3ff628914.png)

同じアプリ・同じテナントでありながら、ログイン方法によってMFAの要求が自動的に出し分けられていることが確認できました。Reactアプリ側のコードは一切変更していません。

---

# 4. （応用編）APIのスコープに応じてMFAを要求する

今回は「ログイン方法」を条件にMFAを出し分けましたが、Actionsの `event` オブジェクトからは他にも様々な認可コンテキストを参照できます。例えば、認可リクエストで要求されたスコープ（`event.transaction.requested_scopes`）を見て、機密性の高い操作に対応するスコープが要求された場合だけMFAを要求する、という組み方も可能です。

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const CLIENTS_WITH_MFA = ['REPLACE_WITH_{yourClientId}'];

  if (CLIENTS_WITH_MFA.includes(event.client.client_id)) {
    if (event.transaction.requested_scopes.indexOf('transfer:funds') > -1) {
      api.multifactor.enable('any', { allowRememberBrowser: true });
    }
  }
};
```

これは「`transfer:funds`（送金）のスコープを要求しているクライアントからのログインにだけMFAを要求する」という[例](https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication/configure-step-up-authentication-for-apis)で、Auth0公式のステップアップ認証ドキュメントでも紹介されているパターンです。ログイン方法だけでなく、「どのAPI・どのスコープにアクセスしようとしているか」という**API認可**の情報もMFAの出し分けの条件に使えることがわかります。

---

# まとめ

Auth0 Actionsを使って、ログイン方法に応じてMFAの要求を動的に出し分けてみました。

* `event.authentication.methods` から、ログインに使われた認証方法（Passkey / ID/パスワードなど）を判定できる
* `api.multifactor.enable("none")` を呼べば、特定の条件下でMFAをスキップできる
* 逆に `api.multifactor.enable("any", ...)` のように呼べば、特定の条件下でMFAを追加で要求することもできる
* 条件には認証方法だけでなく、`event.transaction.requested_scopes` などAPI認可に関する情報も使える
* これらはダッシュボードの「Customize MFA Factors using Actions」を有効化した上で、Reactアプリ側のコードを変更せずに実現できる

Passkeyのようなフィッシング耐性の高い認証方式を「もう一つの要素」とみなしてMFAをスキップする一方、相対的に弱いID/パスワード認証や、機密性の高い操作にはMFAを要求する。Actionsを使うことで、セキュリティとユーザー体験のバランスを、ユースケースに応じて柔軟に調整できることが確認できました。

# 参考

* [Reduce friction with passkeys（公式ドキュメント）](https://auth0.com/docs/customize/actions/explore-triggers/post-login#reduce-friction-with-passkeys)
* [Configure Step-up Authentication for APIs（公式ドキュメント）](https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication/configure-step-up-authentication-for-apis)
* [Auth0公式ReactクイックスタートにMFA（多要素認証）を追加してみた](https://qiita.com/tsasaki0105/items/2eb7680dd1f5be8ebc34)
* [Auth0公式ReactクイックスタートにPasskeyログインを追加してみた](https://qiita.com/tsasaki0105/items/c690767603a413e4d45f)
* [Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた](https://qiita.com/tsasaki0105/items/50787a005dce9ec5b4ef)
* [22日間多くの機能が無料！Auth0で最新の認証基盤を今すぐ始める方法](https://qiita.com/tsasaki0105/items/978a0b65e96a170184ae)
