import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  onDownload?: () => void;
}

export function CodeBlock({
  code,
  language = 'yaml',
  filename,
  showLineNumbers = true,
  onDownload,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-xl border border-surface-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-900 border-b border-surface-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          {filename && (
            <span className="text-sm text-surface-400 ml-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto bg-surface-950">
        <pre className="p-4 text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="leading-relaxed">
                      <td className="pr-4 text-right text-surface-600 select-none w-8">
                        {i + 1}
                      </td>
                      <td className="text-surface-200 whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-surface-200 whitespace-pre">{code}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
