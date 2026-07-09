import { Heart, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-12 px-4 border-t border-zinc-200/40 dark:border-zinc-800/60 mt-12 space-y-6 text-center text-zinc-500 dark:text-zinc-500 text-xs" id="app-footer">
      {/* Mood Engine Documentation Card */}
      <div className="max-w-xl mx-auto p-5 rounded-[20px] glass-card text-left space-y-3.5 shadow-xs">
        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-accent-orange" />
          Predictable Mood Engine Rules
        </h3>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
          Your cat companion is highly sensitive to your task activity and fish care. Here is how its brain works:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-zinc-600 dark:text-zinc-400 font-medium">
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-rose-500">Sad:</span>
            <span>Overdue tasks exist. Clear your overdue work to cheer it up!</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-amber-500">Excited:</span>
            <span>Triggered immediately for 4 seconds upon task completion.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-orange-500">Happy:</span>
            <span>Fed recently (last 2 mins) or completed a task recently.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-rose-400">Hungry:</span>
            <span>Fish are in the stash, but it hasn't been fed in the last 1 minute.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-indigo-400">Sleepy:</span>
            <span>No task completions, additions, or edits in the last 5 minutes.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-extrabold text-orange-400">Calm:</span>
            <span>Default peaceful state. Slow breathing and normal blinking.</span>
          </li>
        </ul>
      </div>

      {/* Author and framework credits */}
      <div className="space-y-1.5">
        <p className="flex items-center justify-center gap-1 font-semibold text-zinc-600 dark:text-zinc-400">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" /> using React, Tailwind CSS, and Local Storage.
        </p>
        <p>© 2026 NekoTask. No server connection required. Your data never leaves your device.</p>
      </div>
    </footer>
  );
}
