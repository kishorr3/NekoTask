import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CatCompanion from './components/CatCompanion';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import { Task, CatMood, CatState, Priority } from './types';

// Initial default tasks for onboarding
const DEFAULT_TASKS: Task[] = [
  {
    id: 'onboarding-1',
    title: 'Feed my cute virtual kitty companion 🐱',
    completed: false,
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0], // today
    createdAt: new Date().toISOString(),
  },
  {
    id: 'onboarding-2',
    title: 'Complete a task to earn a delicious fish 🐟',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0], // today
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  // 1. Load Initial State from Local Storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('nekotodo_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [fishCount, setFishCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nekotodo_fish_count');
      return saved ? parseInt(saved, 10) : 2; // Start with 2 fish to let them try it!
    } catch {
      return 2;
    }
  });

  const [lastFedTime, setLastFedTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nekotodo_last_fed_time');
    } catch {
      return null;
    }
  });

  const [lastActivityTime, setLastActivityTime] = useState<string>(() => {
    try {
      return localStorage.getItem('nekotodo_last_activity_time') || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  });

  const [lastExcitedTime, setLastExcitedTime] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nekotodo_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isEating, setIsEating] = useState(false);
  const [mood, setMood] = useState<CatMood>('calm');

  // 2. Save State to Local Storage on Change
  useEffect(() => {
    try {
      localStorage.setItem('nekotodo_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('nekotodo_fish_count', fishCount.toString());
    } catch (e) {
      console.error('Failed to save fish count:', e);
    }
  }, [fishCount]);

  useEffect(() => {
    try {
      if (lastFedTime) {
        localStorage.setItem('nekotodo_last_fed_time', lastFedTime);
      } else {
        localStorage.removeItem('nekotodo_last_fed_time');
      }
    } catch (e) {
      console.error('Failed to save last fed time:', e);
    }
  }, [lastFedTime]);

  useEffect(() => {
    try {
      localStorage.setItem('nekotodo_last_activity_time', lastActivityTime);
    } catch (e) {
      console.error('Failed to save last activity time:', e);
    }
  }, [lastActivityTime]);

  useEffect(() => {
    try {
      localStorage.setItem('nekotodo_dark_mode', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save dark mode:', e);
    }
    // Update HTML class for dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 3. Mood Calculation Logic
  const updateCatMood = useCallback(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Count overdue pending tasks (due date is in the past, excluding today)
    const overdueCount = tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const tDate = new Date(t.dueDate + 'T23:59:59');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return tDate < today;
    }).length;

    // Check Excited Mode: last excited time was less than 4 seconds ago
    if (lastExcitedTime) {
      const diffExcited = now.getTime() - new Date(lastExcitedTime).getTime();
      if (diffExcited < 4000) {
        setMood('excited');
        return;
      }
    }

    // Check Sad Mode: overdue tasks are piling up
    if (overdueCount > 0) {
      setMood('sad');
      return;
    }

    // Check Happy Mode:
    // Case A: Fed within the last 2 minutes (120,000 ms)
    if (lastFedTime) {
      const diffFed = now.getTime() - new Date(lastFedTime).getTime();
      if (diffFed < 120000) {
        setMood('happy');
        return;
      }
    }

    // Case B: Completed a task in the last 2 minutes
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    if (completedTasks.length > 0) {
      const mostRecentCompletedAt = Math.max(
        ...completedTasks.map(t => new Date(t.completedAt!).getTime())
      );
      const diffCompleted = now.getTime() - mostRecentCompletedAt;
      if (diffCompleted < 120000) {
        setMood('happy');
        return;
      }
    }

    // Check Hungry Mode: Fish are available, but hasn't been fed in the last 1 minute (60,000 ms)
    if (fishCount > 0) {
      if (!lastFedTime) {
        setMood('hungry');
        return;
      } else {
        const diffFed = now.getTime() - new Date(lastFedTime).getTime();
        if (diffFed >= 60000) {
          setMood('hungry');
          return;
        }
      }
    }

    // Check Sleepy Mode: Inactive (no edits/completion/addition/feeds) for more than 5 minutes (300,000 ms)
    const diffActivity = now.getTime() - new Date(lastActivityTime).getTime();
    if (diffActivity >= 300000) {
      setMood('sleepy');
      return;
    }

    // Default: Calm
    setMood('calm');
  }, [tasks, fishCount, lastFedTime, lastActivityTime, lastExcitedTime]);

  // Sync mood dynamically with a 1-second background poll
  useEffect(() => {
    updateCatMood();
    const interval = setInterval(() => {
      updateCatMood();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateCatMood]);

  // 4. State Action Handlers
  const handleAddTask = (title: string, priority: Priority, dueDate?: string) => {
    const nowStr = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: nowStr,
    };
    setTasks(prev => [newTask, ...prev]);
    setLastActivityTime(nowStr);
  };

  const handleToggleComplete = (id: string) => {
    const nowStr = new Date().toISOString();
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            // Completed! Reward +1 fish and trigger Excited mode
            setFishCount(f => f + 1);
            setLastExcitedTime(nowStr);
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? nowStr : undefined,
          };
        }
        return task;
      })
    );
    setLastActivityTime(nowStr);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    setLastActivityTime(new Date().toISOString());
  };

  const handleEditTask = (id: string, updatedTitle: string, updatedPriority: Priority, updatedDueDate?: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            title: updatedTitle,
            priority: updatedPriority,
            dueDate: updatedDueDate,
          };
        }
        return task;
      })
    );
    setLastActivityTime(new Date().toISOString());
  };

  const handleFeed = () => {
    if (fishCount === 0 || isEating) return;
    
    // Spend 1 fish, trigger eating state, set fed & activity times
    setFishCount(f => f - 1);
    setIsEating(true);
    const nowStr = new Date().toISOString();
    setLastFedTime(nowStr);
    setLastActivityTime(nowStr);

    // Eating duration is 2 seconds
    setTimeout(() => {
      setIsEating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-zinc-800 dark:bg-brand-dark dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Soft background radial gradients for warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#FFF9F2_0%,#FAF9F6_100%)] dark:bg-[radial-gradient(circle_at_50%_-20%,#201c18_0%,#121210_100%)] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-orange-100/10 dark:bg-orange-950/2 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full bg-amber-100/10 dark:bg-orange-900/2 blur-[100px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Left Column: Cat Companion (Anchor) */}
          <div className="md:col-span-2 flex flex-col items-center gap-6 sticky top-6">
            <CatCompanion
              catState={{ fishCount, lastFedTime, lastActivityTime, mood }}
              tasks={tasks}
              onFeed={handleFeed}
              isEating={isEating}
            />
          </div>

          {/* Right Column: Planner & Task Manager */}
          <div className="md:col-span-3 space-y-6 w-full">
            <TaskInput onAddTask={handleAddTask} />
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
