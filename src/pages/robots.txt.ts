import type { APIRoute } from "astro";

const getRobotsTxt = (
  sitemapUrl: URL,
) => `# Search indexing and user-initiated retrieval are permitted.
# Crawling for AI/ML training, dataset creation, or bulk content
# aggregation is not permitted.

User-agent: *
Allow: /

# AI/ML training / dataset / bulk content aggregation
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-Agent: meta-externalagent
User-agent: CCBot
User-agent: Diffbot
Disallow: /

# User-initiated search / retrieval
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
Allow: /

Sitemap: ${sitemapUrl.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("sitemap-index.xml", site);

  return new Response(getRobotsTxt(sitemapUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
