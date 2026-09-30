# qiita-content

[Qiita CLI](https://github.com/increments/qiita-cli) で管理している Qiita 投稿記事のソースリポジトリです。主に Auth0 の認証機能に関する記事と、その解説で使用するサンプルアプリケーションを管理しています。

## 構成

```
.
├── public/                    # Qiita記事(Markdown)
├── auth0-react-quickstart/    # 記事で使用するサンプルアプリ (React + Vite + Auth0)
├── qiita.config.json          # Qiita CLI の設定
└── package.json
```

### 記事一覧 (`public/`)

- `auth0_get_start_free_trial.md` — 22日間多くの機能が無料！Auth0で最新の認証基盤を今すぐ始める方法
- `quickstart_by_react.md` — Auth0公式Quickstartで学ぶ！ReactのSPAに認証機能を組み込んでみた
- `quickstart_by_react_passkey.md` — 【Auth0で学ぶ認証強化】Auth0公式ReactクイックスタートにPasskeyログインを追加してみた（1/2）
- `quickstart_by_react_mfa.md` — 【Auth0で学ぶ認証強化】Auth0公式ReactクイックスタートにMFA（多要素認証）を追加してみた（2/2）
- `8067d1dec8c8c0bb72ae.md` — 「認証、マジで意味わからん」と思っていた新入社員SEが、Auth0に救われた話

### サンプルアプリ (`auth0-react-quickstart/`)

Auth0公式の React Quickstart をベースにした、React + Vite + `@auth0/auth0-react` によるSPA認証のサンプルです。記事内のコード解説と対応しています。

## セットアップ

### Qiita CLI のログイン

記事の投稿・更新（`npx qiita publish` など）には Qiita のアクセストークンによるログインが必要です。

```bash
npx qiita login
```

実行すると Qiita のアクセストークンの入力を求められます。トークンは [Qiita の個人設定 > アプリケーション](https://qiita.com/settings/applications) から発行できます。

### 記事の執筆・プレビュー

```bash
npm install
npx qiita preview
```

`qiita.config.json` の設定で `http://0.0.0.0:8888` にプレビューサーバーが起動します。

### サンプルアプリの実行

```bash
cd auth0-react-quickstart
npm install
npm run dev
```

Auth0 のテナント設定（Domain / Client ID など）が必要です。詳細は各記事本文を参照してください。
