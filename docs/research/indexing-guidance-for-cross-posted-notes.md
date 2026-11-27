# 転載ノートのインデックス制御に関する一次情報（2026-11-28 時点）

[#6](https://github.com/saka-naname/v3.sakanana.me/issues/6) の調査結果。[#7](https://github.com/saka-naname/v3.sakanana.me/issues/7) で sakanana.me 側のインデックス制御の方針を決める材料として、Google・Bing・Zenn の一次情報が何を言っているかを集めた。方針はここでは決めない。

前提は、転載ノート（sakanana.me）が非正規の転載先で、原本記事（zenn.dev）が正規版という関係である。用語は `GLOSSARY.md` に従う。

## まとめ

Google と Bing で、転載先に勧めるやり方が分かれている。Google は転載先が付ける canonical を「推奨しない」として noindex を勧め、Bing は転載先に原本記事を指す canonical を勧めている。

1. **別ドメインを指す canonical**：Google は今もヒントとして扱うが、転載（syndication）の用途では推奨していない。理由は、転載ページが原本と大きく異なることが多いから、とされている。Bing は 2025年12月の公式ブログで、転載先に原本を指す canonical を付けてもらうよう勧めている。
2. **noindex との違いと併用**：noindex を付けたページは Google 検索から完全に外れる。canonical は重複ページのまとまりの中から正規版を選ぶためのヒントである。両方を付けることについては、2009年の Google ブログが「付けない」と答えているだけで、現行のドキュメントは触れていない。
3. **sitemap**：Google は「検索結果に出したい URL」を載せるよう求め、sitemap と canonical で別の URL を正規版として示すことを避けるよう書いている。Bing は「canonical URL だけを載せる」としている。noindex のページを載せてよいかは、どちらも明記していない。
4. **og:url**：Open Graph の仕様は og:url を「正規 URL」と定義している。Google と Bing の文書は og:url に触れていない。
5. **Zenn**：記事ごとの canonical・noindex が「できない」と明言した公式文書は見つからなかった。ただ、CLI ガイドの Front Matter の項目、zenn-editor の型定義、2020年から開いたままの要望 issue、記事ページの実際の HTML が、どれも機能がないことを示している。

## 1. 別ドメインを指す canonical は、ヒントとしては今も扱われる

### Google：ヒントとして扱うが、転載の用途では推奨しない

canonical は指示ではなくヒントである、と Google は書いている。

> You can indicate your preference to Google using these techniques, but Google may choose a different page as canonical than you do, for various reasons. That is, indicating a canonical preference is a hint, not a rule.
>
> — [What is canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)（Last updated 2026-08-20）

シグナルの強さの順は、リダイレクト、`rel="canonical"`、sitemap の順である。複数の方法を組み合わせると効果が重なる、とも書かれている。

> rel="canonical" link annotations: A strong signal that the specified URL should become canonical.
>
> Keep in mind that these methods can stack and thus become more effective when combined.
>
> — [How to specify a canonical URL with rel="canonical" and other methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)（Last updated 2026-07-10）

転載についての現行の記述は、canonical のトラブルシューティングのページにある。

> The canonical link element is not recommended for those who want to avoid duplication by syndication partners, because the pages are often very different. The most effective solution is for partners to block indexing of your content.
>
> — [Fix canonicalization issues](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting) の「Syndicated content」（Last updated 2026-08-21）

この文は、自分の記事を他サイトに転載してもらう原本側に向けて書かれている。転載ノートの場合は、sakanana.me がここでいう partner（転載先）に当たる、と筆者は読んだ。挙げられている理由は「転載ページが原本と大きく異なることが多いから」である。全文をほぼそのまま載せる転載ノートにこの理由が当てはまるかは、文書には書かれていない。

リンク先の Google News のヘルプも、同じ内容を書いている。転載先が `<meta name="Googlebot" content="noindex">` を付ければ Google 検索からも外れること、転載先には canonical ではなくメタタグでインデックスを止めてもらうよう勧めること、同じサイトの中の重複なら canonical を使えること、が書かれている（[Avoid article duplication in Google News](https://support.google.com/news/publisher-center/answer/9606800)）。

別ドメインを指す canonical のサポートは、2009年の Google のブログで告知された。

> While the rel="canonical" link element is seen as a hint and not an absolute command, we do try to follow it where possible.
>
> — [Handling legitimate cross-domain content duplication](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain)（John Mueller、2009-12-15）

この記事には、現在は次の注記が付いている。

> Specifically, rel="canonical" is no longer recommended for syndicated content.

同じ記事の Q&A は、ページは同一でなくてよいが似ている必要がある（"they should be similar. Slight differences are fine."）と答えている。

### Google：canonical が無視されやすい条件

現行の文書から読み取れる条件は次のとおり。

- 内容が似ていない。重複かどうかは主要なコンテンツの類似度で判断される（[canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)）。転載で canonical を勧めない理由も「ページが大きく異なることが多い」だった。
- シグナルが食い違っている。sitemap と `rel="canonical"` で別の URL を指すことは、ベストプラクティスで避けるよう書かれている（§3）。
- `hreflang`・`lang`・`media`・`type` 属性の付いた `rel="canonical"` は、正規化に使われない（[consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)）。
- robots.txt でクロールを止めると、canonical が読まれない（2009年のブログの Q&A）。

Google が別の URL を選んだかどうかは、Search Console のページのインデックス登録レポートの「Duplicate, Google chose different canonical than user」で確かめられる。URL 検査では、User-declared canonical と Google-selected canonical を見比べられる（[Page indexing report](https://support.google.com/webmasters/answer/7440203)）。

### Bing：転載先に原本を指す canonical を勧める

Bing Webmaster Guidelines は、重複 URL を canonical URL などでまとめるよう書いている。ただし、転載や別ドメインの canonical には触れていない。

> Use canonical URLs, parameter controls, and consistent URL structures to consolidate signals
>
> — [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) の「6. Consolidate Duplicate URLs」

同じガイドラインの「Duplicate Content Across Multiple URLs」は、canonical について "Canonical tags help signal preference but do not replace fixing underlying issues." と書いている。

転載について具体的に書いているのは、Bing Webmaster Blog の記事である（[Does Duplicate Content Hurt SEO and AI Search Visibility?](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)、Fabrice Canel・Krishna Madhavan、2025-12-19）。「Does syndicated content create duplicate content?」の項で、転載は別ドメインに同じコピーを作り、原本を見分けにくくすると答えている。対処として、契約が許すなら転載先に原本 URL を指す canonical を付けてもらうこと（"Ask partners to add a canonical tag pointing to your original URL"）と、できれば全文ではなく抜粋を転載し、原本へのリンクを付けることを挙げている。これはブログ記事で、ガイドライン本体ではない。

### 二次情報

- Search Engine Journal（Roger Montti、2023-05-05、[記事](https://www.searchenginejournal.com/google-issues-statement-about-support-for-cross-domain-canonicals/486255/)）によると、Google はメールで、別ドメインの canonical も引き続きサポートを試みるが、転載先との重複を避ける目的には勧めない、と答えた。2023年の変更は方針の変更ではなく説明の明確化だ、とも報じている。この記事は要約ツール経由で読んだだけで、引用の原文は確かめていない。
- #6 の背景に挙がっている [Search Engine Land の記事](https://searchengineland.com/google-no-longer-recommends-canonical-tags-for-syndicated-content-406491) は 403 で取得できなかった。

## 2. noindex はページを検索から外し、canonical との併用は現行の文書に記述がない

### noindex の効果

> When Googlebot crawls that page and extracts the tag or header, Google will drop that page entirely from Google Search results, regardless of whether other sites link to it.
>
> — [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)（Last updated 2025-12-10）

同じページによると、noindex は robots.txt でクロールを止めていると読まれない。`<meta name="robots">` は noindex に対応するすべての検索エンジンを、`<meta name="googlebot">` は Google だけを対象にする。Google News のヘルプの例は `Googlebot` を使っているので、そのままでは Bing は対象にならない。Bing のガイドラインは "Use NOINDEX when a URL should NOT appear in Bing search, Copilot experiences, or grounding API results." と書いている。

canonical との違いについて、文書から言えるのは次のことである。canonical は、重複ページのまとまりの中で正規版を選ぶヒントで、リンクなどのシグナルを正規 URL にまとめる目的がある（[consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) の「Reasons to specify a canonical URL」）。noindex は、そのページを検索結果から外す指示である。noindex のページが受けたリンクなどのシグナルが原本に引き継がれるかは、今回読んだ Google の文書には書かれていない。

なお、consolidate-duplicate-urls には「noindex を正規化に使うことは勧めない」という一文がある。ただしこれは "within a single site"（同じサイトの中）と限定されているので、別ドメインの転載にそのまま当てはめることはできない。

### canonical と noindex の併用

一次情報で直接答えているのは、2009年の Google のブログだけである。

> Should I use a noindex robots meta tag on pages with a rel="canonical" link element?
>
> No, since those pages would not be equivalent with regards to indexing—one would be allowed while the other would be blocked.
>
> — [Handling legitimate cross-domain content duplication](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain)（2009-12-15）

この記事には「情報が古い可能性がある」という注記が付いている。今回読んだ現行の Google の文書（canonicalization、consolidate-duplicate-urls、canonicalization-troubleshooting、block-indexing、robots-meta-tag）と、Bing のガイドライン・ブログ記事には、併用についての記述がなかった。

## 3. sitemap には検索結果に出したい正規 URL を載せる

Google の sitemap の作り方のページは、検索結果に出したい URL を載せるよう求めている。

> Include the URLs in your sitemap that you want to see in Google's search results.
>
> If you have the same content accessible under different URLs, choose the URL you prefer and include that in the sitemap instead of all URLs that lead to the same content.
>
> — [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)（Last updated 2026-07-08）

正規化のベストプラクティスには、次の項目がある。

> Don't specify different URLs as canonical for the same page using different canonicalization techniques (for example, don't specify one URL in a sitemap, but a different URL for that same page using rel="canonical").
>
> — [consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) の「Best practices」

同じページには "All pages listed in a sitemap are suggested as canonicals" ともある。転載ノートの URL を sitemap に載せたまま canonical で zenn.dev を指すと、この「食い違い」に当たる、と筆者は読んだ。例は同じサイトの中を想定しているように読めるが、別ドメインに当てはまるかは書かれていない。

Bing のガイドラインの「3. Use Sitemaps to Signal Importance and Freshness」は、sitemap に載せるべきものとして "List only canonical URLs" を挙げている。

noindex のページを sitemap に載せてよいかは、Google・Bing のどちらも明記していない。

## 4. og:url は仕様上「正規 URL」とされ、検索エンジンの文書は触れていない

[The Open Graph protocol](https://ogp.me/) は、og:url を "The canonical URL of your object" と定義している。グラフの中で恒久的な ID として使われる、とも書かれている。

Meta の開発者向け文書 [Specify a Canonical URL](https://developers.facebook.com/docs/sharing/webmasters/getting-started/versioned-link) は、次のように書いている。

- og:url で正規 URL を指定する
- 同じ正規 URL を指すリンクは、同じリソースとして扱われる
- 2020年2月3日以降は、別ドメインの URL を正規 URL に指定できない。ただし、相手のドメインが許可リストに入れていれば指定できる

このページは curl では取得できず、要約ツール経由でしか読めなかった。上の内容は言い換えで、原文は確かめていない。

今回読んだ Google の文書（§2 に挙げた5ページと sitemap のページ）と Bing のガイドラインには、og:url や Open Graph への言及がなかった。Google と Bing が og:url を正規化のシグナルに使うかは、一次情報からは分からない。

参考として、原本記事のページは og:url も canonical も自分の URL（`https://zenn.dev/sakananame/articles/react-native-expo-for-nextjs-users`）を指している。

## 5. Zenn には記事ごとの canonical・noindex の設定がない

「できない」と明言した公式文書は見つからなかった。次の4つが、機能がないことを示している。

1. **CLI ガイド**：[Zenn CLI で記事・本を管理する方法](https://zenn.dev/zenn/articles/zenn-cli-guide) の Front Matter に出てくる項目は、`title`・`emoji`・`type`・`topics`・`published`・`published_at` である。canonical や robots に当たる項目はない。他のブログから Zenn に移す場合に `published_at` に過去の日時を指定できる、という記述はある。
2. **型定義**：zenn-editor の [`packages/zenn-model/src/types.ts`](https://github.com/zenn-dev/zenn-editor/blob/9a194121b85a3740e93df069a499191fc9ab8057/packages/zenn-model/src/types.ts)（commit 9a19412、2026-09-03）の `Article` 型の項目は、`slug`・`title`・`bodyHtml`・`toc`・`emoji`・`type`・`topics`・`tags`・`published`・`published_at`・`publication_name` だけである。
3. **要望 issue**：[zenn-dev/zenn-community#78「記事に canonical_url を設定できるように」](https://github.com/zenn-dev/zenn-community/issues/78) は 2020-09-26 に立てられ、2026-11-28 時点で Open のままである。運営側の立場で答えている catnose99 は、やりたい気持ちはあるが、SEO を狙ったスパムに悪用されるおそれがある、と書いている（2020-09-26、2020-10-18）。
4. **実際の出力**：原本記事のページは、自分の URL を指す `<link rel="canonical">` を出力している。`<meta name="robots">` と `X-Robots-Tag` ヘッダーはなかった（2026-11-28 に取得）。

[Zenn のマニュアル](https://zenn.dev/manual) に並ぶ21本の記事にも、canonical や noindex を扱うものはなかった。中身まで確認したのは editor-guide、markdown-guide、publication-pro-features、about-article-translation で、いずれも canonical・noindex・インデックスに触れていない。

Zenn 側の SEO の方針は、2020年の [ユーザー投稿型サイトのSEO対策](https://zenn.dev/team_zenn/articles/2060cd717894cfa7a0c4)（Zenn 公式ブログ、2020-10-13）に書かれている。インデックスしてほしいページのほぼすべてに canonical を付け、投稿のないユーザーページなど品質の低いページにだけ noindex を付ける、という内容である。

## #7 で選ぶときの材料

一次情報が支える範囲を、選択肢ごとに並べる。どれを選ぶかは #7 で決める。

| sakanana.me 側の選択肢 | 支える一次情報 | 食い違う一次情報 |
|---|---|---|
| zenn.dev を指す canonical だけを付ける | Bing のブログ（2025-12）。Google は別ドメインの canonical をヒントとして扱う | Google は転載の用途では推奨しない |
| noindex だけを付ける | Google のトラブルシューティングのページと Google News のヘルプ。Bing も noindex を尊重する | Bing のブログは canonical を勧めている |
| canonical と noindex を両方付ける | なし | 2009年の Google ブログが「付けない」と答えている（古い記事という注記つき） |

どれを選んでも、sitemap と og:url の扱いが関わってくる。sitemap については、Google が検索結果に出したい URL だけを載せるよう求めており（§3）、Bing は canonical URL だけを載せるよう求めている。og:url は仕様上「正規 URL」なので、canonical と同じ先を指すのが定義に沿う、と筆者は読んだ。ただし Meta は別ドメインの og:url を制限している（§4、未確認）。

## データの限界

- すべて 2026-11-28 に取得した内容である。Google の文書の更新日は、各ページの「Last updated」の値を書いた。
- Meta の og:url の文書と Search Engine Journal の記事は、要約ツール経由でしか読めていない。Search Engine Land は 403 で取得できなかった。
- Bing の転載についての記述はブログ記事で、ガイドライン本体には転載や別ドメインの canonical の記述がない。Bing のほかのヘルプ記事は調べていない。
- Google の office hours や Search Central の Q&A 動画、John Mueller らの SNS 上の発言は調べていない。
- Zenn については、「できない」を明言した公式文書がない。ここに挙げたのは機能がないことの状況証拠である。

## 方法

Google・Bing・Zenn・OGP の各ページを curl で取得し、本文を抜き出してから、canonical・noindex・syndicat・sitemap・og: などの語で検索した。Bing のガイドラインは JavaScript で描画されるため、ページが内部で呼んでいる `https://www.bing.com/webmasters/api/help/htmlcontent?ArticleId=30fba23a` から本文を取得した。zenn-editor と zenn-community は `gh api` と `gh issue view` で読んだ。

読んだページ：

- Google Search Central
  - [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)（2026-08-20）
  - [consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)（2026-07-10）
  - [canonicalization-troubleshooting](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting)（2026-08-21）
  - [block-indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing)（2025-12-10）
  - [robots-meta-tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)（2026-03-24）
  - [build-sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)（2026-07-08）
  - [spam-policies](https://developers.google.com/search/docs/essentials/spam-policies)（2026-11-23。転載ノートに直接関わる記述はなかった）
  - [2009年のブログ記事](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain)
- Google のヘルプ
  - [Avoid article duplication in Google News](https://support.google.com/news/publisher-center/answer/9606800)
  - [ページのインデックス登録レポート](https://support.google.com/webmasters/answer/7440203)
- Bing
  - [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
  - [Bing Webmaster Blog（2025-12-19）](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)
- Open Graph
  - [ogp.me](https://ogp.me/)
  - [Meta: Specify a Canonical URL](https://developers.facebook.com/docs/sharing/webmasters/getting-started/versioned-link)（要約ツール経由）
- Zenn
  - [zenn-cli-guide](https://zenn.dev/zenn/articles/zenn-cli-guide)
  - [manual](https://zenn.dev/manual) と、その中の4記事
  - [team_zenn の SEO 記事](https://zenn.dev/team_zenn/articles/2060cd717894cfa7a0c4)
  - [zenn-editor の types.ts](https://github.com/zenn-dev/zenn-editor/blob/9a194121b85a3740e93df069a499191fc9ab8057/packages/zenn-model/src/types.ts)
  - [zenn-community#78](https://github.com/zenn-dev/zenn-community/issues/78)
  - 原本記事の HTML とレスポンスヘッダー

Google Search Central のページの引用は、CC BY 4.0 のライセンスに基づく。
