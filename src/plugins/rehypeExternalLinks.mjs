import { URL } from "node:url";

import { visit } from "unist-util-visit";

function createExternalLinkIcon() {
  return {
    type: "element",
    tagName: "span",
    properties: {
      ariaHidden: "true",
      className: ["external-link-icon"],
    },
    children: [],
  };
}

export function rehypeExternalLinks({ site }) {
  const siteOrigin = new URL(site).origin;

  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string") return;

      let url;
      try {
        url = new URL(href, site);
      } catch {
        return;
      }

      if (!/^https?:$/.test(url.protocol) || url.origin === siteOrigin) return;

      const className = Array.isArray(node.properties.className)
        ? node.properties.className
        : node.properties.className
          ? [node.properties.className]
          : [];

      node.properties.className = [...className, "external-link"];
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
      node.children.unshift(createExternalLinkIcon());
    });
  };
}
