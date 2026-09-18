import React from 'react';
import ReactMarkdown from 'react-markdown';

const components = {
  p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-black text-inherit">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 ml-4 list-disc space-y-1.5 marker:text-yellow-500">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1.5 marker:font-black marker:text-yellow-600">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  h1: ({ children }) => (
    <h1 className="text-base font-black text-inherit mt-3 mb-1.5 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-black text-inherit mt-3 mb-1.5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-black text-inherit mt-2.5 mb-1 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xs font-black uppercase tracking-wide text-inherit mt-2 mb-1 first:mt-0">
      {children}
    </h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-yellow-400 pl-3 text-inherit/90 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/5 px-1 py-0.5 text-[12px] font-bold font-mono">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-xl bg-gray-900 text-yellow-100 px-3 py-2 text-[12px] font-mono whitespace-pre [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit [&>code]:font-mono">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-yellow-700 underline underline-offset-2 hover:text-yellow-800"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-gray-200" />,
};

/**
 * Renders coach AI / chat content with markdown (**bold**, lists, headings, etc.).
 */
export default function CoachMarkdown({ children, className = '' }) {
  const text = children == null ? '' : String(children);
  if (!text.trim()) return null;

  return (
    <div className={`coach-md break-words ${className}`}>
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
}
