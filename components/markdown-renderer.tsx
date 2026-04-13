import ReactMarkdown, { type Components } from "react-markdown";

import { markdownRehypePlugins, markdownRemarkPlugins } from "@/lib/markdown";

type MarkdownRendererProps = {
  content: string;
};

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="mt-8 text-3xl font-bold tracking-tight first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 text-xl font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mt-4 leading-7 text-foreground/90">{children}</p>,
  a: ({ href, children }) => {
    const isExternal = Boolean(href && /^https?:\/\//.test(href));

    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-muted pl-4 italic text-muted-foreground">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-6 text-foreground">{children}</pre>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
