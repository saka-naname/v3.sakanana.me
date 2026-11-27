---
title: Next.js 使いが React Native + Expo でモバイルアプリ開発に入門するだけ
summary: PROTOTYPE 用のダミー転載ノート。Next.js に慣れた人が React Native と Expo でモバイルアプリ開発を始めるときに戸惑った点をまとめた記事、という想定。
slug: prototype-original-article
category: engineering
tags: [React Native, Expo, Next.js]
publishedAt: 2026-09-03
updatedAt: 2026-11-07
originalArticle:
  url: https://zenn.dev/sakananame/articles/react-native-expo-for-nextjs-users
  medium: Zenn
relatedWorks: []
---

これはプロトタイプ用のダミー本文です。Next.js の感覚で React Native + Expo を触ると、ルーティングやスタイリングの考え方の違いに最初は戸惑います。

## ルーティング

Expo Router はファイルベースのルーティングなので、Next.js の App Router に近い感覚で書けます。

```tsx
export default function Home() {
  return <Text>Hello</Text>;
}
```

## スタイリング

CSS は使えないので、`StyleSheet.create` でスタイルを書きます。

## まとめ

ダミー本文はここまでです。
