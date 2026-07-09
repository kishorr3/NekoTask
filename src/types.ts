export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD
  priority: Priority;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
}

export type CatMood = 'calm' | 'happy' | 'excited' | 'hungry' | 'sleepy' | 'sad';

export interface CatState {
  fishCount: number;
  lastFedTime: string | null; // ISO string
  lastActivityTime: string; // ISO string
  mood: CatMood;
}

export interface AppState {
  tasks: Task[];
  cat: CatState;
  darkMode: boolean;
}
