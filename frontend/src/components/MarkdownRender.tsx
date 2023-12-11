import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MarkdownRender({ content, title }: { content: string , title: boolean}) {
  const markdownStyle = {
    fontSize: "1.5rem",
  };

  return (
    <MarkdownPreview
      source={content}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      style={title ? markdownStyle : {}}
    />
  );
}
