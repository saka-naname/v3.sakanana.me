# 転載ノートの移植ルール

原本記事を転載ノートとして Notes に移植するときのルールと手順。次の記事を移植するときにも、この文書に従う。用語は `GLOSSARY.md` を参照。

転載ノートは、原本記事を正規版としたまま Notes にも掲載したノートである。詳細ページには `<meta name="robots" content="noindex">` を出し、`<link rel="canonical">` を出さず、sitemap からも外す。これらは frontmatter に `originalArticle` を書くだけで有効になる。

## frontmatter

`originalArticle` に原本記事の URL と媒体名を書く。`url` と `medium` はどちらも必須で、片方だけ書くとビルドが失敗する。`medium` は自由な文字列で、媒体の正式な表記で書く。

```yaml
originalArticle:
  url: https://zenn.dev/sakananame/articles/react-native-expo-for-nextjs-users
  medium: Zenn
```

日付は時刻を持たず、日本時間の日付で書く。

- `publishedAt`：原本記事の公開日。Zenn なら `published_at`。
- `updatedAt`：原本記事の本文の更新日。Zenn なら `body_updated_at`。本文を更新していなければ書かない。

記法の変換など、Notes 側だけの調整では `updatedAt` を進めない。

## Zenn の記法

| Zenn               | Notes        |
| ------------------ | ------------ |
| `:::message`       | `:::info`    |
| `:::message alert` | `:::warning` |

callout の1行目が太字だけの段落なら、その文字列を見出しに移し、太字の段落は消す。

```md
:::message
**注意**
本文
:::
```

は次のようにする。

```md
:::info[注意]
本文
:::
```

ここにない記法は、その記法を使う記事を移植するときに扱いを決め、この文書に書き足す。

## メタ情報

- `topics`：サイトの既存のタグに表記を合わせ、1対1で `tags` に移す。
- `emoji`、`type`：移さない。
- `category`：ノートごとに手で選ぶ。
- `summary`：移植するときに新しく書く。タイトルを補う短い一文にし、本文から抜き出さない。

## 原本記事を更新したとき

原本記事を更新したら、本文と `updatedAt` を手で転載ノートに反映する。

## 公開後の確認

公開後、Search Console の URL 検査で転載ノートの noindex が検出されているかを確かめる。手順の詳細は確認用の issue を参照。
