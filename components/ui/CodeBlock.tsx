import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Détection automatique du langage basé sur le contenu
  const detectLanguage = (code: string): string => {
    if (code.includes('<?php')) return 'php';
    if (code.includes('import React') || code.includes('const ') || code.includes('function ')) return 'javascript';
    if (code.includes('<template>') || code.includes('<script setup>')) return 'vue';
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('SELECT ') || code.includes('INSERT INTO')) return 'sql';
    if (code.includes('class ') && code.includes('public ')) return 'java';
    if (code.includes('<div') || code.includes('<html')) return 'html';
    if (code.includes('{') && code.includes('color:')) return 'css';
    return language;
  };

  const detectedLanguage = detectLanguage(code);

  return (
    <div className="relative group">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-[#1e1e1e] border border-neon-cyan/30
                   hover:border-neon-cyan transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Copier le code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-neon-green" />
        ) : (
          <Copy className="w-4 h-4 text-neon-cyan" />
        )}
      </button>

      {/* Language Badge */}
      <div className="absolute top-3 right-16 px-2 py-0.5 rounded bg-[#1e1e1e]/80 border border-neon-cyan/20 z-10">
        <span className="text-[10px] font-normal text-neon-cyan/70 uppercase tracking-wide">{detectedLanguage}</span>
      </div>

      {/* Code Block */}
      <div className="rounded-lg overflow-hidden border-2 border-neon-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
        <SyntaxHighlighter
          language={detectedLanguage}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '2rem 1rem 1rem 1rem',
            background: '#0f0f1a',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#6e7681',
            userSelect: 'none',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
