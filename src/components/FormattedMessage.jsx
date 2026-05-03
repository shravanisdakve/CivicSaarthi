import React from 'react';
import FormattedText from './FormattedText.jsx';

// Inline Markdown Parser: handles **bold** and *italic*
const renderInlineMarkdown = (text) => {
  if (!text) return null;

  // Split by **bold** first
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return <strong key={i} className="font-bold inherit"><FormattedText text={innerText} /></strong>;
    }
    // Then handle *italic* (optional, but good for completeness)
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, j) => {
      if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
         return <em key={`${i}-${j}`} className="italic"><FormattedText text={subPart.slice(1, -1)} /></em>;
      }
      return <FormattedText key={`${i}-${j}`} text={subPart} />;
    });
  });
};

export default function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = null; // { type: 'ul'|'ol', items: [] }

  const pushList = () => {
    if (currentList && currentList.items.length > 0) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`list-${elements.length}`} className="mb-4 pl-5 space-y-2 list-disc list-outside marker:text-primary">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1 leading-relaxed inherit">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="mb-4 pl-5 space-y-3 list-decimal list-outside marker:font-bold marker:text-primary">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1 leading-relaxed inherit">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines, but they might terminate a list
    if (!trimmed) {
      pushList();
      return;
    }

    // Check for Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      pushList();
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const Tag = `h${level}`;
      const classes = {
        h1: "text-xl font-bold mt-6 mb-3 inherit",
        h2: "text-lg font-bold mt-5 mb-3 inherit",
        h3: "text-base font-bold mt-4 mb-2 inherit",
        h4: "text-sm font-bold mt-3 mb-2 inherit",
        h5: "text-sm font-bold mt-3 mb-2 inherit",
        h6: "text-xs font-bold mt-3 mb-2 inherit uppercase tracking-wide",
      };
      elements.push(<Tag key={index} className={classes[Tag]}>{renderInlineMarkdown(content)}</Tag>);
      return;
    }

    // Check for Blockquotes
    const quoteMatch = trimmed.match(/^>\s+(.*)/);
    if (quoteMatch) {
      pushList();
      elements.push(
        <blockquote key={index} className="border-l-4 border-primary/30 pl-4 italic bg-slate-50 py-3 px-4 rounded-r-lg my-4 inherit">
          {renderInlineMarkdown(quoteMatch[1])}
        </blockquote>
      );
      return;
    }

    // Check for Ordered Lists (e.g. "1. Item")
    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    if (olMatch) {
      if (currentList && currentList.type !== 'ol') pushList();
      if (!currentList) currentList = { type: 'ol', items: [] };
      currentList.items.push(olMatch[2]);
      return;
    }

    // Check for Unordered Lists (e.g. "- Item" or "* Item")
    const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      // Avoid treating bold start as a list item
      if (!trimmed.startsWith('** ')) {
        if (currentList && currentList.type !== 'ul') pushList();
        if (!currentList) currentList = { type: 'ul', items: [] };
        currentList.items.push(ulMatch[1]);
        return;
      }
    }

    // Important Tips handling
    const isTip = trimmed.toUpperCase().includes('IMPORTANT TIPS') || 
                  trimmed.toUpperCase().includes('महत्वपूर्ण टिपा') ||
                  trimmed.toUpperCase().includes('महत्वपूर्ण टिप्स');
    if (isTip) {
      pushList();
      elements.push(
        <div key={index} className="my-5 p-5 bg-amber-50/80 rounded-3xl border border-amber-200/50 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-[10px] uppercase tracking-[0.2em] mb-2">
            <span className="material-symbols-outlined text-lg">tips_and_updates</span>
            {renderInlineMarkdown(trimmed)}
          </div>
        </div>
      );
      return;
    }

    // Standard Paragraph
    pushList();
    elements.push(
      <p key={index} className="mb-4 last:mb-0 inherit leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  pushList();

  return <div className="w-full text-sm">{elements}</div>;
}
