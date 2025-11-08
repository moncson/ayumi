# マイグレーションガイド：マルチテナント対応

## 概要

このマイグレーションは、既存のシングルテナント構成をマルチテナント構成に移行します。

## 実行内容

1. **デフォルトメディアテナント「ふらっと。」の作成**
   - メディア名: ふらっと。
   - スラッグ: furatto
   - サブドメイン: furatto

2. **既存データへのmediaId付与**
   - 記事（articles）
   - カテゴリー（categories）
   - タグ（tags）
   - バナー（banners）
   - メディアファイル（media）

## 実行前の準備

### 1. Firebase認証情報の設定

**オプションA: サービスアカウントキーを使用（推奨）**

```bash
# Firebase Consoleからサービスアカウントキーをダウンロード
# プロジェクト設定 > サービスアカウント > 新しい秘密鍵を生成

# 環境変数に設定
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

**オプションB: Application Default Credentials（ADC）を使用**

```bash
# Firebase CLIでログイン
firebase login

# ADCを設定
gcloud auth application-default login
```

### 2. 依存関係の確認

```bash
# ts-nodeがインストールされていることを確認
npm list ts-node

# インストールされていない場合
npm install --save-dev ts-node
```

## 実行方法

### 1. ドライラン（推奨）

まず、スクリプトの内容を確認してください：

```bash
# スクリプトの内容を確認
cat scripts/migrate-add-media-id.ts
```

### 2. 本番実行

⚠️ **警告**: このスクリプトは既存データを変更します。必ずバックアップを取ってから実行してください。

```bash
# マイグレーション実行
npx ts-node scripts/migrate-add-media-id.ts
```

### 3. 実行後の確認

```bash
# Firebase Consoleで以下を確認
# 1. tenants コレクションに「ふらっと。」が作成されているか
# 2. articles, categories, tags, banners, media の各ドキュメントに mediaId が追加されているか
```

## 実行後の手動作業

### デフォルトメディアのオーナーID更新

マイグレーション実行後、デフォルトメディアの`ownerId`を実際の管理者UIDに更新してください：

**Firebase Consoleで更新：**

1. Firebase Console > Firestore Database
2. `tenants` コレクションを開く
3. デフォルトメディアのドキュメントを開く
4. `ownerId` フィールドを実際の管理者UIDに変更
5. `memberIds` 配列に管理者UIDを追加

**または、Firebase CLIで更新：**

```bash
# 自分のUIDを確認
firebase auth:export users.json --format=JSON
# または管理画面の「アカウント管理」で確認

# テナントのownerIdを更新
# （Firestore REST APIまたはコンソールで手動更新）
```

## トラブルシューティング

### エラー: "Permission denied"

→ Firebase認証情報が正しく設定されていません。「実行前の準備」を確認してください。

### エラー: "Module not found: ts-node"

```bash
npm install --save-dev ts-node typescript
```

### エラー: "Cannot find module 'firebase-admin'"

```bash
npm install firebase-admin
```

### 既にmediaIdが存在する場合

スクリプトは既に`mediaId`が設定されているドキュメントをスキップします。安全に再実行可能です。

## ロールバック方法

もしマイグレーションを取り消したい場合：

```bash
# Firestore Console で手動削除、または以下のスクリプトを実行

# 全コレクションからmediaIdフィールドを削除
npx ts-node scripts/rollback-media-id.ts
```

（注: rollbackスクリプトは別途作成が必要です）

## 次のステップ

マイグレーション完了後：

1. ✅ 管理画面でメディア切り替えが動作することを確認
2. ✅ 記事・カテゴリー・タグが正しく表示されることを確認
3. ✅ 新規記事作成時にmediaIdが自動付与されることを確認
4. 🔜 既存APIルートにmediaIdフィルタリングを追加（次フェーズ）
5. 🔜 ドメインベースのテナント判定実装（次フェーズ）

