import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MarkdownRender({ content, style }: { content: string , style: any}) {

  const markdownBackgroundStyle = {
    backgroundColor: "transparent",
  };

  return (
    <MarkdownPreview
      source={content}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      style={{ ...style, ...markdownBackgroundStyle }}
      className="markdown-body"
    />
  );
}
