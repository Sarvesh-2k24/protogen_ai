import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2563eb',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#3b82f6',
    lineColor: '#60a5fa',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    edgeLabelBackground: '#1e293b',
    nodeTextColor: '#f8fafc',
    fontSize: '13px'
  },
  securityLevel: 'loose'
});

/**
 * Sanitize Mermaid code to ensure node labels with parentheses (e.g. (IMP)) or colons are double-quoted
 */
function sanitizeMermaid(rawCode) {
  if (!rawCode) return '';
  const lines = rawCode.split('\n').map(line => {
    // 1. Quote square bracket nodes: Node[Label (with parens)] -> Node["Label (with parens)"]
    let l = line.replace(/([A-Za-z0-9_]+)\[([^"\]\n]+)\]/g, (m, id, label) => {
      const clean = label.replace(/"/g, "'").trim();
      return `${id}["${clean}"]`;
    });

    // 2. Quote decision diamond nodes: Node{Decision (test)} -> Node{"Decision (test)"}
    l = l.replace(/([A-Za-z0-9_]+)\{([^"\}\n]+)\}/g, (m, id, label) => {
      const clean = label.replace(/"/g, "'").trim();
      return `${id}{"${clean}"}`;
    });

    // 3. Quote rounded nodes: Node(Label (text)) -> Node("Label (text)")
    l = l.replace(/([A-Za-z0-9_]+)\(([^"\)\n]+)\)/g, (m, id, label) => {
      const clean = label.replace(/"/g, "'").trim();
      return `${id}("${clean}")`;
    });

    // 4. Quote edge labels: -->|Label (info)| -> -->|"Label (info)"|
    l = l.replace(/-->\|([^"\|\n]+)\|/g, (m, label) => {
      const clean = label.replace(/"/g, "'").trim();
      return `-->|"${clean}"|`;
    });

    return l;
  });
  return lines.join('\n');
}

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!code || !code.trim()) return;
      const cleanCode = sanitizeMermaid(code.trim());
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      try {
        const { svg: renderedSvg } = await mermaid.render(id, cleanCode);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (err) {
        console.warn('Mermaid rendering issue (handled cleanly):', err);
        // Remove any rogue Mermaid error elements injected by mermaid into DOM
        const rogueEl = document.getElementById(id);
        if (rogueEl) rogueEl.remove();
        const dErrorEl = document.getElementById(`d${id}`);
        if (dErrorEl) dErrorEl.remove();

        if (isMounted) setError(true);
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [code]);

  if (error || !svg) {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-750 text-xs text-slate-300">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
          <span className="font-semibold text-blue-400 text-xs">
            Trial Schema Flowchart (Text Representation)
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
            ICH M11 Schema
          </span>
        </div>
        <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-5 p-4 rounded-xl bg-slate-900/90 border border-slate-750 shadow-inner flex flex-col items-center overflow-x-auto">
      <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Visual Trial Schema Flowchart
      </span>
      <div
        ref={containerRef}
        className="w-full flex justify-center py-2 [&>svg]:max-w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
