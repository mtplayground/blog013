import type { PluggableList } from "unified";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), ["id"]],
    h2: [...(defaultSchema.attributes?.h2 ?? []), ["id"]],
    h3: [...(defaultSchema.attributes?.h3 ?? []), ["id"]],
    h4: [...(defaultSchema.attributes?.h4 ?? []), ["id"]],
    h5: [...(defaultSchema.attributes?.h5 ?? []), ["id"]],
    h6: [...(defaultSchema.attributes?.h6 ?? []), ["id"]],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ["className"],
      ["ariaHidden"],
      ["tabIndex"],
    ],
  },
};

export const markdownRemarkPlugins: PluggableList = [remarkGfm];

export const markdownRehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  [rehypeSanitize, sanitizeSchema],
];
