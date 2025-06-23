#!/bin/bash

# GitHubリポジトリのURLを設定（YOUR_USERNAME と REPOSITORY_NAME を置き換えてください）
# 例: git remote add origin https://github.com/YOUR_USERNAME/kobe-clinic-shift-system.git

echo "GitHubにプッシュする手順:"
echo "1. GitHubで新しいリポジトリを作成"
echo "2. 以下のコマンドを実行:"
echo ""
echo "# リモートリポジトリを追加"
echo "git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git"
echo ""
echo "# mainブランチに切り替え"
echo "git branch -M main"
echo ""
echo "# GitHubにプッシュ"
echo "git push -u origin main"