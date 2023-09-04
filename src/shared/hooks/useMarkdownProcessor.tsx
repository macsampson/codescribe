// Custom Dialog component rendered with Radix.
// import { Dialog } from "@/components/dialog";
// highlight.js syntax highlighting theme for the code blocks.
import "highlight.js/styles/base16/green-screen.css";
// Import all of the necessary packages.
import { createElement, Fragment, useEffect, useMemo, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import ReactMarkdown from "react-markdown";

export const useMarkdownProcessor = (content: string) => {
  //   useEffect(() => {
  //     mermaid.initialize({ startOnLoad: false, theme: "forest" });
  //   }, []);
  // console.log("useMarkdownProcessor: ", content);
  return useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }: JSX.IntrinsicElements["a"]) => (
            <a href={href} target="_blank" rel="noreferrer" className="...">
              {children}
            </a>
          ),
          h1: ({ children, id }: JSX.IntrinsicElements["h1"]) => (
            <h1 className="..." id={id}>
              {children}
            </h1>
          ),
          h2: ({ children, id }: JSX.IntrinsicElements["h2"]) => (
            <h2 className="..." id={id}>
              {children}
            </h2>
          ),
          h3: ({ children, id }: JSX.IntrinsicElements["h3"]) => (
            <h3 className="..." id={id}>
              {children}
            </h3>
          ),
          h4: ({ children, id }: JSX.IntrinsicElements["h4"]) => (
            <h4 className="..." id={id}>
              {children}
            </h4>
          ),
          h5: ({ children, id }: JSX.IntrinsicElements["h5"]) => (
            <h5 className="..." id={id}>
              {children}
            </h5>
          ),
          h6: ({ children, id }: JSX.IntrinsicElements["h6"]) => (
            <h6 className="..." id={id}>
              {children}
            </h6>
          ),
          p: ({ children }: JSX.IntrinsicElements["p"]) => {
            return <p className="mb-4">{children}</p>;
          },
          strong: ({ children }: JSX.IntrinsicElements["strong"]) => (
            <strong className="...">{children}</strong>
          ),
          em: ({ children }: JSX.IntrinsicElements["em"]) => (
            <em>{children}</em>
          ),
          code: CodeBlock,
          pre: ({ children }: JSX.IntrinsicElements["pre"]) => {
            return (
              <div className="...">
                <pre className="...">{children}</pre>
              </div>
            );
          },
          ul: ({ children }: JSX.IntrinsicElements["ul"]) => (
            <ul className="...">{children}</ul>
          ),
          ol: ({ children }: JSX.IntrinsicElements["ol"]) => (
            <ol className="...">{children}</ol>
          ),
          li: ({ children }: JSX.IntrinsicElements["li"]) => (
            <li className="mb-4">{children}</li>
          ),
          table: ({ children }: JSX.IntrinsicElements["table"]) => (
            <div className="...">
              <table className="...">{children}</table>
            </div>
          ),
          thead: ({ children }: JSX.IntrinsicElements["thead"]) => (
            <thead className="...">{children}</thead>
          ),
          th: ({ children }: JSX.IntrinsicElements["th"]) => (
            <th className="...">{children}</th>
          ),
          td: ({ children }: JSX.IntrinsicElements["td"]) => (
            <td className="...">{children}</td>
          ),
          blockquote: ({ children }: JSX.IntrinsicElements["blockquote"]) => (
            <blockquote className="...">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content]);
};

// A more complex custom component for the `code` element.
const CodeBlock = ({ children, className }: JSX.IntrinsicElements["code"]) => {
  // State to display the Mermaid diagram.
  const [showMermaidPreview, setShowMermaidPreview] = useState(false);

  // Highlight.js adds a `className` so this is a hack to detect if the code block
  // is a language block wrapped in a `pre` tag versus an inline `code` tag.
  if (className) {
    // Determine if it's a mermaid diagram code block.
    const isMermaid = className.includes("language-mermaid");

    return (
      <>
        <code className={"mb-2"}>{children}</code>
        {/* If the code block is a Mermaid diagram, display additional UI to allow rendering it. */}
        {/* <div className="...">
          {isMermaid ? (
            <>
              <button
                type="button"
                className="..."
                onClick={() => {
                  setShowMermaidPreview(true);
                }}
              >
              
                Open Mermaid preview
              </button>
              <Dialog
                open={showMermaidPreview}
                setOpen={setShowMermaidPreview}
                title="Mermaid diagram preview"
                size="3xl"
              >
                <Mermaid content={children?.toString() ?? ""} />
              </Dialog>
            </>
          ) : null}
        </div> */}
      </>
    );
  }

  // Handle an inline `code` tag.
  return (
    <code className="bg-sky-200 text-sky-800 p-1 rounded font-bold">
      {children}
    </code>
  );
};
