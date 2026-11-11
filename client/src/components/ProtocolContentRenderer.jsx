import React from 'react';
import { marked } from 'marked';
import MermaidDiagram from './MermaidDiagram';

marked.setOptions({
  breaks: true,
  gfm: true
});

/**
 * Splits markdown text and renders mermaid code blocks visually
 */
export default function ProtocolContentRenderer({ content }) {
  if (!content) return null;

  // Regex to extract ```mermaid ... ```
  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        data: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'mermaid',
      data: match[1]
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      data: content.substring(lastIndex)
    });
  }

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        if (part.type === 'mermaid') {
          return <MermaidDiagram key={idx} code={part.data} />;
        }
        return (
          <div
            key={idx}
            className="prose prose-invert prose-blue max-w-none protocol-preview text-slate-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: marked.parse(part.data) }}
          />
        );
      })}
    </div>
  );
}

