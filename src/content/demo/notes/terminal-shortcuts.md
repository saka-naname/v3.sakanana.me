---
title: よく使うターミナル操作を短くする
summary: 繰り返し入力する確認コマンドを、覚えやすい単位へまとめるための小さな工夫。
slug: terminal-shortcuts
category: tips
tags: [Terminal, Git, Workflow]
publishedAt: 2026-01-19
relatedWorks:
  - komorebi-cli
---

> これはNotesページの表示確認用に作成したダミー記事です。内容は実在しそうなTipsとして構成しています。

長いコマンドを何でもaliasにすると、別の環境で手が止まります。完全に隠すのではなく、目的が分かる短い名前だけを用意しています。

```sh
alias gst='git status --short'
alias glg='git log --oneline --decorate -12'
```

頻度が低い操作は履歴検索で十分です。毎日使い、入力を間違えやすく、実行結果を予測できるものだけを短くしています。
