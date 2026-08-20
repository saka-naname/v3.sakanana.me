import { visit } from "unist-util-visit";

const calloutTypes = new Set(["info", "tip", "warning", "danger"]);

export function remarkCalloutDirectives() {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      if (!calloutTypes.has(node.name)) return;

      const data = node.data || (node.data = {});
      data.hName = "aside";
      data.hProperties = {
        className: ["callout", `callout-${node.name}`],
        role: "note",
      };

      const label = node.children.find(
        (child) => child.data?.directiveLabel === true,
      );

      if (label) {
        const labelData = label.data || (label.data = {});
        labelData.hProperties = { className: ["callout-title"] };
      }
    });
  };
}
