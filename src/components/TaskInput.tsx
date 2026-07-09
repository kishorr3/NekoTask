import React, { useState } from 'react';
import { Priority } from '../types';
import { Calendar, Plus, AlertCircle, ChevronDown, Flag } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (title: string, priority: Priority, dueDate?: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please write a task first! 😊');
      return;
    }
    setError('');
    onAddTask(title.trim(), priority, dueDate || undefined);
    setTitle('');
    // Keep priority and clear due date for next tasks
    setDueDate('');
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'border-rose-500/30 text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400';
      case 'medium':
        return 'border-orange-500/30 text-orange-600 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400';
      case 'low':
        return 'border-zinc-300 text-zinc-600 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    }
  };

  return (
    <div 
      className="p-6 rounded-[20px] glass-card shadow-sm transition-all duration-300 w-full"
      id="task-input-card"
    >
      <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
        <span className="p-1.5 bg-accent-orange/10 dark:bg-accent-orange/25 text-accent-orange dark:text-orange-400 rounded-lg">
          <Plus className="w-4 h-4" />
        </span>
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title Input */}
        <div>
          <label htmlFor="task-title-input" className="sr-only">Task Title</label>
          <input
            id="task-title-input"
            type="text"
            placeholder="What needs doing? (e.g. Clean the kitchen...)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-medium text-sm transition-all duration-200"
            maxLength={100}
            aria-describedby={error ? "input-error-msg" : undefined}
          />
          {error && (
            <p id="input-error-msg" className="text-xs text-rose-500 dark:text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
        </div>

        {/* Priority & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isActive = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? p === 'high'
                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200 dark:shadow-none'
                          : p === 'medium'
                          ? 'bg-accent-orange text-white border-orange-600 shadow-sm shadow-accent-orange/20 dark:shadow-none'
                          : 'bg-zinc-800 text-white border-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:border-white shadow-sm'
                        : 'bg-transparent text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                    }`}
                    aria-label={`Select ${p} priority`}
                    aria-pressed={isActive}
                  >
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due date picker */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-due-date" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Due Date <span className="text-zinc-400 dark:text-zinc-600 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-zinc-800 dark:text-zinc-100 text-sm font-medium transition-all duration-200 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md shadow-accent-orange/10 hover:shadow-accent-orange/20 active:translate-y-0 hover:-translate-y-0.5"
          aria-label="Add this task to list"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task to Journey</span>
        </button>
      </form>
    </div>
  );
}
