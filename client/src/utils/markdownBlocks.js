/**
 * Markdown Block Splitting and Reconstruction Utility
 * Enables paragraph-level pointing, inline editing, and commenting in clinical protocol drafts.
 */

export function splitMarkdownIntoBlocks(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split('\n');
  const blocks = [];
  let currentLines = [];
  let currentType = 'paragraph';
  let inFence = false;
  let inTable = false;

  const flush = () => {
    if (currentLines.length === 0) return;
    const raw = currentLines.join('\n').trim();
    if (raw) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: currentType,
        rawText: raw
      });
    }
    currentLines = [];
    currentType = 'paragraph';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code / Mermaid blocks
    if (trimmed.startsWith('```')) {
      if (!inFence) {
        flush();
        inFence = true;
        currentType = trimmed.includes('mermaid') ? 'mermaid' : 'code';
        currentLines.push(line);
      } else {
        currentLines.push(line);
        inFence = false;
        flush();
      }
      continue;
    }
    if (inFence) {
      currentLines.push(line);
      continue;
    }

    // Markdown Table rows
    if (trimmed.startsWith('|')) {
      if (!inTable) {
        flush();
        inTable = true;
        currentType = 'table';
      }
      currentLines.push(line);
      continue;
    } else if (inTable) {
      inTable = false;
      flush();
    }

    // Horizontal Rule / Divider
    if (trimmed === '---' || trimmed === '***') {
      flush();
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'divider',
        rawText: '---'
      });
      continue;
    }

    // Headings (#, ##, ###, ####)
    if (/^#{1,6}\s/.test(trimmed)) {
      flush();
      currentType = 'heading';
      currentLines.push(line);
      flush();
      continue;
    }

    // Blank lines separate regular paragraphs
    if (!trimmed) {
      flush();
      continue;
    }

    currentLines.push(line);
  }

  flush();
  return blocks;
}

export function joinBlocksToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map(b => (b.rawText ? b.rawText.trim() : ''))
    .filter(Boolean)
    .join('\n\n');
}

export function updateBlockInMarkdown(fullMarkdown, blockIndex, newBlockText) {
  const blocks = splitMarkdownIntoBlocks(fullMarkdown);
  if (blockIndex >= 0 && blockIndex < blocks.length) {
    blocks[blockIndex].rawText = newBlockText;
  }
  return joinBlocksToMarkdown(blocks);
}

