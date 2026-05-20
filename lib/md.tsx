import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ node, ...props }) => (
          <h2 className="mt-10 font-heading text-2xl font-semibold text-foreground" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground" {...props} />
        ),
        p: ({ node, ...props }) => <p className="mt-4 leading-8 text-muted-foreground" {...props} />,
        li: ({ node, ...props }) => <li className="mt-2 text-muted-foreground" {...props} />,
        a: ({ node, ...props }) => <a className="text-primary underline underline-offset-4" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
