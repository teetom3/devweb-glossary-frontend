'use client';

import { useState } from 'react';
import { Code, Eye, EyeOff } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = "// Ajoutez votre code ici\nconst exemple = 'Hello World';",
  rows = 10,
  error
}: CodeEditorProps) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="space-y-3">
      {/* Toggle Preview Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-secondary border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan transition-all text-sm"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Masquer l'aperçu</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Afficher l'aperçu</span>
            </>
          )}
        </button>
      </div>

      <div className={`grid ${showPreview ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {/* Editor */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">Éditeur</span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 rounded-lg bg-[#0f0f1a] border-2 border-neon-cyan/30 text-foreground placeholder:text-gray-600 text-sm focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 resize-y"
            style={{
              minHeight: `${rows * 1.5}rem`,
              lineHeight: '1.7',
              tabSize: 2,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
            }}
          />
          {error && (
            <p className="mt-2 text-sm text-neon-pink">{error}</p>
          )}
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-neon-magenta" />
              <span className="text-sm font-medium text-neon-magenta">Aperçu</span>
            </div>
            {value ? (
              <CodeBlock code={value} showLineNumbers={true} />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-glass-border p-8 text-center text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">L'aperçu du code apparaîtra ici</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-background-secondary/50 border border-glass-border rounded-lg p-3">
        <p className="text-xs text-gray-400">
          <strong className="text-neon-cyan">Astuce :</strong> Le code sera automatiquement coloré selon le langage détecté (JavaScript, PHP, Python, HTML, CSS, etc.)
        </p>
      </div>
    </div>
  );
}
