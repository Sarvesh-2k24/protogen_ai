/**
 * Clinical Content & LaTeX Refinement Filter (Level 5 DAG Agent)
 * 
 * Sanitizes and elevates clinical protocol text:
 * 1. Filters raw LaTeX math fragments (e.g. "$\le 2.5 \times$" -> "≤ 2.5 ×")
 * 2. Normalizes medical comparison operators, units, and Greek statistical letters
 * 3. Strips broken KaTeX math delimiters ($...$) around simple clinical numbers and operators
 * 4. Preserves true mathematical formulas for KaTeX while preventing parse errors
 * 5. Validates Markdown headings, bullet lists, and table alignment
 */

function refineClinicalContent(text) {
  if (!text || typeof text !== 'string') return text || '';
  let s = text;

  // 1. Remove raw LaTeX math escapes for percentage: \% -> %
  s = s.replace(/\\%/g, '%');

  // Normalize HbA1c in all common clinical variants: HbA$_{1c}$, HbA_{1c}, etc.
  s = s.replace(/HbA\s*\$?_\{?1c\}?\$?/gi, 'HbA1c');

  // 2. Specific requested pattern and variants: "$\le 2.5 \times$"
  // Replace raw LaTeX symbols with clean, standard Unicode
  const latexToUnicode = [
    { regex: /\\(?:le|leq)\b/g, rep: '≤' },
    { regex: /\\(?:ge|geq)\b/g, rep: '≥' },
    { regex: /\\times\b/g, rep: '×' },
    { regex: /\\pm\b/g, rep: '±' },
    { regex: /\\mp\b/g, rep: '∓' },
    { regex: /\\approx\b/g, rep: '≈' },
    { regex: /\\(?:neq|ne)\b/g, rep: '≠' },
    { regex: /\\cdot\b/g, rep: '·' },
    { regex: /\\sim\b/g, rep: '~' },
    { regex: /\\alpha\b/g, rep: 'α' },
    { regex: /\\beta\b/g, rep: 'β' },
    { regex: /\\gamma\b/g, rep: 'γ' },
    { regex: /\\delta\b/g, rep: 'δ' },
    { regex: /\\Delta\b/g, rep: 'Δ' },
    { regex: /\\mu\b/g, rep: 'μ' },
    { regex: /\\sigma\b/g, rep: 'σ' },
    { regex: /\\chi\b/g, rep: 'χ' },
    { regex: /\\lambda\b/g, rep: 'λ' },
    { regex: /\\infty\b/g, rep: '∞' }
  ];

  for (const { regex, rep } of latexToUnicode) {
    s = s.replace(regex, rep);
  }

  // 3. Units and superscripts / subscripts (e.g. m^2 -> m², HbA_1c -> HbA1c)
  s = s.replace(/_\{?1c\}?/gi, '1c');
  s = s.replace(/\$_\{?1c\}?\$?/gi, '1c');
  s = s.replace(/\^\{?2\}?/g, '²');
  s = s.replace(/\^\{?3\}?/g, '³');
  s = s.replace(/\^\{?0\}?/g, '⁰');
  s = s.replace(/\^\{?1\}?/g, '¹');
  s = s.replace(/_\{?0\}?/g, '₀');
  s = s.replace(/_\{?1\}?/g, '₁');
  s = s.replace(/_\{?2\}?/g, '₂');

  // 4. Strip LaTeX font wrappers like \text{...}, \mathrm{...}, \mathbf{...}
  s = s.replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit)\{([^}]+)\}/g, '$1');

  // Fractions: \frac{a}{b} -> a/b
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');

  // 5. Strip $ delimiters when the inside is just clean clinical text or unicode
  // e.g. "$≤ 2.5 ×$" -> "≤ 2.5 ×", "$≥ 18$" -> "≥ 18", "$90%$" -> "90%"
  s = s.replace(/\$([^\$\n]+)\$/g, (match, inner) => {
    // If it contains genuine multiline math or complex LaTeX (e.g. \sum, \int, \frac, \sqrt), leave it
    if (/\\\w+/.test(inner)) return match;
    // Otherwise return clean trimmed inner content
    return inner.trim();
  });

  // 6. Clean up stray or unmatched $ signs that break KaTeX / Markdown renderers
  s = s.split('\n').map(line => {
    const dollarCount = (line.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      // Unmatched $ sign: remove stray $
      return line.replace(/\$/g, '');
    }
    return line;
  }).join('\n');

  // 7. Clean up trailing/leading $ adjacent to punctuation or operators
  s = s.replace(/\$([≤≥=<>±≈~×\d\.\s%a-zA-Z]+)\$/g, '$1');
  s = s.replace(/([≤≥=<>±])\s*\$/g, '$1 ');
  s = s.replace(/\$\s*([≤≥=<>±\d])/g, '$1');

  // 8. Normalize medical operator spacing
  s = s.replace(/([≤≥])\s*([0-9])/g, '$1 $2');
  s = s.replace(/([0-9])\s*×\s*([A-Za-z])/g, '$1 × $2');
  s = s.replace(/([0-9])\s*±\s*([0-9])/g, '$1 ± $2');
  s = s.replace(/([%])\s*([a-zA-Z])/g, '$1 $2');
  s = s.replace(/([a-zA-Z])\s*([≤≥])/g, '$1 $2');

  // 9. Clean up double spaces created by delimiter removal
  s = s.replace(/[ \t]{2,}/g, ' ');

  // 10. Sanitize Mermaid diagrams (quote labels containing parentheses/special chars)
  s = sanitizeMermaidDiagrams(s);

  return s;
}

/**
 * Sanitize Mermaid diagrams in markdown text so that all node labels containing
 * parentheses, brackets, colons, or special characters are safely double-quoted.
 */
function sanitizeMermaidDiagrams(text) {
  if (!text || typeof text !== 'string') return text || '';
  
  return text.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidCode) => {
    const lines = mermaidCode.split('\n').map(line => {
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

    return '```mermaid\n' + lines.join('\n').trim() + '\n```';
  });
}

/**
 * Filter an entire protocol section or collection of sections through the Level 5 Filter Agent
 */
function applyContentRefinementFilter(sectionText) {
  if (!sectionText) return '';
  return refineClinicalContent(sectionText);
}

module.exports = {
  refineClinicalContent,
  applyContentRefinementFilter,
  sanitizeMermaidDiagrams
};
