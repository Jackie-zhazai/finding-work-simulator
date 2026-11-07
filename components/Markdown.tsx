import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export default function Markdown({text}:{text:string}){
 const content=text.replace(/^```(?:markdown|md)\s*\n([\s\S]*)\n```\s*$/i,'$1');
 return <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{a:({children,href})=><a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,img:({alt})=><span>{alt||'图片已省略'}</span>}}>{content}</ReactMarkdown></div>;
}
