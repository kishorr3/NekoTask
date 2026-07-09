import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { Check, Trash2, Edit2, Calendar, AlertTriangle, CheckSquare, Square, Filter, ArrowUpDown, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updatedTitle: string, updatedPriority: Priority, updatedDueDate?: string) => void;
}

type StatusFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
type SortOption = 'created-desc' | 'due-asc' | 'priority-desc';

export default function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created-desc');
  
  // Track which task is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editDueDate, setEditDueDate] = useState('');

  // Is a task overdue?
  const isOverdue = (task: Task) => {
    if (task.completed || !task.dueDate) return false;
    
    // Create date representation for due date and current date (midnight comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(task.dueDate + 'T23:59:59'); // end of day local
    return taskDate < today;
  };

  // Start editing a task
  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
  };

  // Save the edited task
  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onEditTask(id, editTitle.trim(), editPriority, editDueDate || undefined);
    setEditingId(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const statusMatch = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && !task.completed) || 
      (statusFilter === 'completed' && task.completed);

    const priorityMatch = 
      priorityFilter === 'all' || 
      task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'created-desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortBy === 'due-asc') {
      // Keep tasks without due date at the end
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    if (sortBy === 'priority-desc') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }

    return 0;
  });

  // Helper colors for badges
  const getPriorityBadgeClass = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/20';
      case 'medium':
        return 'bg-accent-orange/10 text-accent-orange dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/20';
      case 'low':
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50';
    }
  };

  // For accessible keyboard interactions
  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="space-y-4 w-full" id="task-list-section">
      {/* Filtering & Sorting Controls */}
      <div className="p-4 rounded-2xl glass-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-sm">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status buttons */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            {(['all', 'active', 'completed'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  statusFilter === f
                    ? 'bg-white dark:bg-brand-dark-card text-accent-orange dark:text-orange-400 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
                aria-label={`Filter by ${f} tasks`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Priority dropdown-like filter */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            {(['all', 'high', 'medium', 'low'] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-white dark:bg-brand-dark-card text-accent-orange dark:text-orange-400 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
                aria-label={`Filter by ${p} priority`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-100 dark:border-zinc-800/80">
          <label htmlFor="sort-selector" className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </label>
          <select
            id="sort-selector"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer"
          >
            <option value="created-desc">Newest Added</option>
            <option value="due-asc">Due Date (Soonest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Task Count Indicator */}
      <div className="text-right px-1">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-bold text-accent-orange">{sortedTasks.length}</span> of {tasks.length} tasks
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-10 text-center rounded-[20px] bg-white/40 dark:bg-brand-dark-card/30 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center justify-center gap-2"
            >
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No tasks found matching these filters!</p>
              <p className="text-xs text-accent-orange/80 dark:text-accent-orange font-semibold">Ready to give your kitty some fish? Create a task!</p>
            </motion.div>
          ) : (
            sortedTasks.map((task) => {
              const isTaskEditing = editingId === task.id;
              const isTaskOverdue = isOverdue(task);

              return (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-[18px] bg-white dark:bg-brand-dark-card border shadow-xs transition-all duration-300 ${
                    task.completed
                      ? 'border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5'
                      : isTaskOverdue
                      ? 'border-rose-100 dark:border-rose-950/30 bg-rose-50/10 dark:bg-rose-950/5'
                      : 'border-zinc-150 dark:border-zinc-800/80 hover:border-accent-orange/40 dark:hover:border-accent-orange/20'
                  }`}
                  id={`task-card-${task.id}`}
                >
                  {isTaskEditing ? (
                    /* EDIT MODE */
                    <div className="space-y-3" aria-label={`Editing task: ${task.title}`}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 font-medium focus:ring-1 focus:ring-accent-orange focus:outline-none"
                        placeholder="Task title"
                        autoFocus
                      />
                      
                      <div className="flex flex-col md:flex-row gap-2 justify-between">
                        {/* Inline priority & date */}
                        <div className="flex gap-2">
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as Priority)}
                            className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                            aria-label="Edit priority"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>

                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                            aria-label="Edit due date"
                          />
                        </div>

                        {/* Save & Cancel buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancelEdit()}
                            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="px-3 py-1.5 rounded-lg bg-accent-orange hover:bg-orange-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL CARD VIEW */
                    <div className="flex items-start gap-3">
                      {/* Interactive Custom Checkbox */}
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 cursor-pointer ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-none'
                            : isTaskOverdue
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 text-rose-500 hover:bg-rose-100'
                            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-transparent hover:border-accent-orange'
                        }`}
                        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                      >
                        {task.completed ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                        )}
                      </button>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          {/* Priority badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Overdue Badge */}
                          {isTaskOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Overdue
                            </span>
                          )}

                          {/* Completed Date Badge */}
                          {task.completed && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              +1 Fish Earned! 🐟
                            </span>
                          )}
                        </div>

                        {/* Task title */}
                        <p className={`text-sm font-semibold leading-relaxed break-words ${
                          task.completed 
                            ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-[2px]' 
                            : 'text-zinc-800 dark:text-zinc-100'
                        }`}>
                          {task.title}
                        </p>

                        {/* Date details */}
                        {task.dueDate && (
                          <div className={`flex items-center gap-1.5 mt-2 text-xs font-bold ${
                            task.completed
                              ? 'text-zinc-400 dark:text-zinc-500'
                              : isTaskOverdue
                              ? 'text-rose-500 dark:text-rose-400'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}>
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Due: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 self-center shrink-0">
                        {/* Edit Button */}
                        {!task.completed && (
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Edit task: ${task.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all duration-150 cursor-pointer"
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
