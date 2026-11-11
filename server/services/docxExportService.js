/**
 * DOCX Document Export Service for Clinical Trial Protocols
 * Converts protocol markdown sections into a formal Microsoft Word (.docx) document
 */

const {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  Packer
} = require('docx');

const { refineClinicalContent } = require('./clinicalContentFilter');

/**
 * Clean markdown symbols and filter LaTeX math for word doc paragraphs
 */
function stripMarkdown(text) {
  if (!text) return '';
  const cleaned = refineClinicalContent(text);
  return cleaned
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1');
}

/**
 * Generate DOCX buffer from protocol state
 */
async function generateProtocolDocx({ title, sections, metadata = {} }) {
  const docChildren = [];

  // Title Page Header
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 300 },
      children: [
        new TextRun({
          text: 'CLINICAL TRIAL PROTOCOL',
          bold: true,
          size: 36,
          color: '1E3A8A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 600 },
      children: [
        new TextRun({
          text: title || 'Investigational Clinical Trial Protocol',
          bold: true,
          size: 28,
          color: '0F172A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `Protocol Identifier: PRT-${new Date().getFullYear()}-001`,
          size: 22,
          color: '475569'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `Harmonized Format: ICH M11 / SPIRIT 2013 Standard`,
          size: 20,
          italics: true,
          color: '64748B'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 1200 },
      children: [
        new TextRun({
          text: `Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
          size: 20,
          color: '475569'
        })
      ]
    }),
    new Paragraph({
      pageBreakBefore: true,
      children: [
        new TextRun({
          text: 'Table of Contents',
          heading: HeadingLevel.HEADING_1,
          bold: true,
          size: 30,
          color: '1E3A8A'
        })
      ]
    })
  );

  // List of sections in TOC
  sections.forEach((sec, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text: `${sec.title}`,
            bold: true,
            size: 22,
            color: '1E293B'
          })
        ]
      })
    );
  });

  // Section contents
  sections.forEach((sec, idx) => {
    // Page break before major section
    docChildren.push(
      new Paragraph({
        pageBreakBefore: true,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: sec.title,
            bold: true,
            size: 28,
            color: '1E3A8A'
          })
        ]
      })
    );

    const content = sec.content || sec.description || 'Section content not yet generated.';
    const lines = content.split('\n');

    let inTable = false;
    let tableRows = [];

    lines.forEach(line => {
      const trimmed = line.trim();

      if (!trimmed) {
        if (inTable && tableRows.length > 0) {
          // Flush table
          docChildren.push(buildTable(tableRows));
          tableRows = [];
          inTable = false;
        }
        return;
      }

      // Check table markdown
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        // Skip separator row like |:---|:---|
        if (!trimmed.match(/^\|[\s\-:]+(\|[\s\-:]+)+\|$/)) {
          const cells = trimmed
            .split('|')
            .slice(1, -1)
            .map(c => stripMarkdown(c.trim()));
          tableRows.push(cells);
        }
        return;
      } else if (inTable && tableRows.length > 0) {
        docChildren.push(buildTable(tableRows));
        tableRows = [];
        inTable = false;
      }

      // Check headings
      if (trimmed.startsWith('### ')) {
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: stripMarkdown(trimmed.replace('### ', '')),
                bold: true,
                size: 24,
                color: '2563EB'
              })
            ]
          })
        );
      } else if (trimmed.startsWith('#### ')) {
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: stripMarkdown(trimmed.replace('#### ', '')),
                bold: true,
                size: 22,
                color: '0F172A'
              })
            ]
          })
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: stripMarkdown(trimmed.replace(/^[-*]\s+/, '')),
                size: 21,
                color: '334155'
              })
            ]
          })
        );
      } else if (trimmed.match(/^\d+\.\s+/)) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: stripMarkdown(trimmed),
                size: 21,
                color: '334155'
              })
            ]
          })
        );
      } else if (trimmed.startsWith('```')) {
        // Code or diagram skip line
      } else {
        docChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: stripMarkdown(trimmed),
                size: 21,
                color: '334155'
              })
            ]
          })
        );
      }
    });

    if (inTable && tableRows.length > 0) {
      docChildren.push(buildTable(tableRows));
      tableRows = [];
      inTable = false;
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

function buildTable(rows) {
  const tableRows = rows.map((rowCells, rIdx) => {
    return new TableRow({
      children: rowCells.map(cellText => {
        return new TableCell({
          width: { size: 100 / Math.max(rowCells.length, 1), type: WidthType.PERCENTAGE },
          shading: rIdx === 0 ? { fill: 'F1F5F9' } : undefined,
          children: [
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: cellText,
                  bold: rIdx === 0,
                  size: 19,
                  color: rIdx === 0 ? '0F172A' : '334155'
                })
              ]
            })
          ]
        });
      })
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

module.exports = {
  generateProtocolDocx
};

