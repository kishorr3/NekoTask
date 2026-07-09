import { Sun, Moon, Sparkles } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-4 z-10" id="app-header">
      {/* Brand logo & name */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-accent-orange flex items-center justify-center text-white shadow-sm hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-4.5 h-4.5 fill-white" />
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 leading-none">
            NekoTask
          </h1>
          <p className="text-[9px] font-bold text-accent-orange uppercase tracking-widest mt-1 leading-none">Cat Companion Planner</p>
        </div>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-white/80 dark:border-zinc-800/80 shadow-sm backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer text-zinc-600 dark:text-zinc-300"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
      </button>
    </header>
  );
}
