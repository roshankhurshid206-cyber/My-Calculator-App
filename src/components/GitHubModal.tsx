import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, ExternalLink, GitBranch, ShieldCheck } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const targetRepo = repoUrl.trim() || 'https://github.com/YOUR_USERNAME/calculator.git';

  const bashSnippet = `# 1. Add your GitHub repository as remote origin
git remote add origin ${targetRepo}

# 2. Set main branch and push
git branch -M main
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bashSnippet);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Push Codebase to Your GitHub
              </h3>
              <p className="text-[11px] text-slate-500">
                Local repository is initialized & staged ready for push
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Status Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              Git repository is initialized on <strong>main</strong> branch with all source files committed.
            </span>
          </div>

          {/* GitHub Repo URL input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Your GitHub Repository URL</span>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                Create new repo on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/your-username/calculator.git"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Terminal commands */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Terminal className="w-3.5 h-3.5" />
                Terminal Push Command
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
              {bashSnippet}
            </pre>
          </div>

          {/* Quick steps */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              How to complete push in 1 minute:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>
                Create an empty repository on{' '}
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 dark:text-amber-400 underline"
                >
                  GitHub.com
                </a>{' '}
                (do not initialize with README).
              </li>
              <li>Paste your repo URL above to customize the snippet.</li>
              <li>Click <strong>Copy Commands</strong> and run it in your terminal.</li>
              <li>Your complete calculator app is now published on your GitHub!</li>
            </ol>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> Branch: main
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
