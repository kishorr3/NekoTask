import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CatMood, CatState, Task } from '../types';
import { Fish, Heart, Moon, Volume2, Sparkles, Smile, MessageSquare, AlertCircle } from 'lucide-react';

interface CatCompanionProps {
  catState: CatState;
  tasks: Task[];
  onFeed: () => void;
  isEating: boolean;
}

export default function CatCompanion({ catState, tasks, onFeed, isEating }: CatCompanionProps) {
  const { mood, fishCount } = catState;
  const [speech, setSpeech] = useState<string>('Meow! Welcome back, human.');
  const [crumbs, setCrumbs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [crumbId, setCrumbId] = useState(0);

  // Auto-update speech bubble based on mood and tasks
  useEffect(() => {
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate + 'T23:59:59') < new Date()).length;
    const pendingCount = tasks.filter(t => !t.completed).length;

    if (isEating) {
      setSpeech('Munch munch munch... absolutely delicious! 🐟✨');
      return;
    }

    switch (mood) {
      case 'excited':
        setSpeech('HOORAY! You completed a task! You are amazing! 🌟🎉');
        break;
      case 'sad':
        if (overdueCount > 0) {
          setSpeech(`Oh dear... we have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. Let's tackle them! 😿`);
        } else {
          setSpeech("I feel a little down... let's check some things off!");
        }
        break;
      case 'happy':
        if (pendingCount === 0 && tasks.length > 0) {
          setSpeech('Wow, all tasks are done! You are a master organiser! 😸💖');
        } else {
          setSpeech('*Soft purring sounds* You are doing great, keep going! 🌸');
        }
        break;
      case 'hungry':
        setSpeech(fishCount > 0 
          ? 'Meow... I see you have tasty fish! Can I have one? 🥺🐟' 
          : 'My tummy is rumbling... completing tasks will get us fish! 😿');
        break;
      case 'sleepy':
        setSpeech('Yawn... it is so quiet and peaceful. Purr... 💤');
        break;
      case 'calm':
      default:
        if (pendingCount > 0) {
          setSpeech(`We have ${pendingCount} task${pendingCount > 1 ? 's' : ''} to focus on today. You've got this! 🐾`);
        } else {
          setSpeech('Ready to write some goals? Add a task below! 📝🐱');
        }
        break;
    }
  }, [mood, tasks, isEating, fishCount]);

  // Handle crumb generation for eating animation
  useEffect(() => {
    if (isEating) {
      // Spawn 8 crumbs
      const newCrumbs = Array.from({ length: 8 }).map((_, i) => ({
        id: crumbId + i,
        x: (Math.random() - 0.5) * 80, // random distance left/right
        y: Math.random() * 40 + 20,     // random downward float
      }));
      setCrumbs(prev => [...prev, ...newCrumbs]);
      setCrumbId(prev => prev + 8);

      // Clean up crumbs after 800ms
      const timer = setTimeout(() => {
        setCrumbs([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isEating]);

  // Helper to determine cat colors based on dark mode or mood
  const getCatColors = () => {
    switch (mood) {
      case 'sad':
        return {
          body: '#CBD5E1', // Dimmed coat (grayish slate)
          belly: '#F1F5F9',
          blush: 'rgba(244, 63, 94, 0.1)',
        };
      case 'sleepy':
        return {
          body: '#FFE4E6', // Soft sleepy rose
          belly: '#FFF1F2',
          blush: 'rgba(244, 63, 94, 0.2)',
        };
      case 'excited':
        return {
          body: '#FDBA74', // Bright glowing ginger
          belly: '#FFEDD5',
          blush: 'rgba(244, 63, 94, 0.6)',
        };
      case 'happy':
        return {
          body: '#FB923C', // Beautiful warm orange
          belly: '#FFEDD5',
          blush: 'rgba(244, 63, 94, 0.5)',
        };
      case 'hungry':
        return {
          body: '#FCA5A5', // Soft pleading pink-orange
          belly: '#FEE2E2',
          blush: 'rgba(244, 63, 94, 0.3)',
        };
      case 'calm':
      default:
        return {
          body: '#FDBA74', // Classic ginger/orange cat
          belly: '#FFF7ED',
          blush: 'rgba(244, 63, 94, 0.35)',
        };
    }
  };

  const colors = getCatColors();

  // Handle ear animations based on mood
  const getEarRotation = (side: 'left' | 'right') => {
    if (side === 'left') {
      if (mood === 'sad') return -22;
      if (mood === 'sleepy') return -12;
      if (mood === 'excited') return 4;
      if (mood === 'hungry') return -2;
      return 0; // calm / happy
    } else {
      if (mood === 'sad') return 22;
      if (mood === 'sleepy') return 12;
      if (mood === 'excited') return -4;
      if (mood === 'hungry') return 2;
      return 0;
    }
  };

  // Check prefers-reduced-motion setting
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div className="w-full flex flex-col items-center select-none" id="cat-companion-section">
      {/* Speech Bubble */}
      <div className="relative mb-6 max-w-sm px-5 py-3.5 rounded-2xl bg-white/60 dark:bg-brand-dark-card/60 backdrop-blur-md shadow-sm border border-white/80 dark:border-zinc-800/80 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all duration-300">
        <p className="flex items-center justify-center gap-1.5">
          {mood === 'happy' && <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />}
          {mood === 'excited' && <Sparkles className="w-4 h-4 text-amber-500 animate-spin shrink-0" />}
          {mood === 'sleepy' && <Moon className="w-4 h-4 text-indigo-400 shrink-0" />}
          {mood === 'sad' && <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />}
          <span>{speech}</span>
        </p>
        {/* Chat pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white/60 dark:border-t-brand-dark-card/60" />
      </div>

      {/* Cat Interactive Stage */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Purring Waves (Happy Mode) */}
        {mood === 'happy' && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="absolute w-52 h-52 rounded-full border border-orange-300/30 purring-circle" />
            <div className="absolute w-60 h-60 rounded-full border border-orange-400/20 purring-circle [animation-delay:0.7s]" />
            <div className="absolute w-68 h-68 rounded-full border border-orange-500/10 purring-circle [animation-delay:1.4s]" />
          </div>
        )}

        {/* Dynamic Cat SVG Container */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : mood === 'excited'
              ? { y: [0, -25, 0], scaleY: [1, 0.9, 1.05, 1] }
              : mood === 'sleepy'
              ? { y: [0, 2, 0], scale: [1, 0.99, 1] }
              : { y: [0, -3, 0] } // gentle breathing
          }
          transition={
            reducedMotion
              ? {}
              : mood === 'excited'
              ? { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
              : mood === 'sleepy'
              ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative w-48 h-48 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_10px_15px_rgba(249,115,22,0.1)] transition-all duration-500"
            aria-label={`Interactive SVG of your virtual cat companion in a ${mood} state`}
          >
            {/* TAIL */}
            <motion.path
              d="M 130 160 Q 170 145 160 110 Q 150 75 175 60 C 185 55 180 45 170 50 Q 140 65 145 105 Q 150 135 120 152 Z"
              fill={colors.body}
              originX="130px"
              originY="160px"
              animate={
                reducedMotion
                  ? {}
                  : mood === 'sad'
                  ? { rotate: [0] }
                  : mood === 'excited'
                  ? { rotate: [-10, 15, -10], scaleY: [1, 1.1, 1] }
                  : mood === 'happy'
                  ? { rotate: [-15, 20, -15] }
                  : { rotate: [-5, 5, -5] } // calm / hungry / sleepy gentle wag
              }
              transition={
                reducedMotion
                  ? {}
                  : mood === 'excited'
                  ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
                  : mood === 'happy'
                  ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }
            />

            {/* BODY */}
            <path
              d="M 60 170 C 60 135 70 115 100 115 C 130 115 140 135 140 170 C 140 185 130 190 100 190 C 70 190 60 185 60 170 Z"
              fill={colors.body}
            />

            {/* WHITE BELLY */}
            <ellipse cx="100" cy="158" rx="28" ry="24" fill={colors.belly} />

            {/* PAWS */}
            {/* Left Paw */}
            <rect x="75" y="172" width="16" height="14" rx="7" fill={colors.body} />
            <line x1="80" y1="178" x2="80" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="178" x2="86" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />

            {/* Right Paw */}
            <rect x="109" y="172" width="16" height="14" rx="7" fill={colors.body} />
            <line x1="114" y1="178" x2="114" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />
            <line x1="120" y1="178" x2="120" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />

            {/* CAT HEAD & EARS GROUP (Tilts slightly in Hungry state) */}
            <motion.g
              animate={
                reducedMotion
                  ? {}
                  : mood === 'hungry'
                  ? { rotate: -8, x: -4, y: 2 }
                  : { rotate: 0, x: 0, y: 0 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              originX="100px"
              originY="105px"
            >
              {/* LEFT EAR */}
              <motion.path
                d="M 58 75 L 32 30 C 28 24 38 18 48 24 L 84 56 Z"
                fill={colors.body}
                originX="58px"
                originY="75px"
                animate={{ rotate: getEarRotation('left') }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              />
              {/* Left Inner Ear */}
              <motion.path
                d="M 54 71 L 36 36 Q 44 32 49 35 L 75 58 Z"
                fill="#F87171"
                opacity="0.5"
                originX="58px"
                originY="75px"
                animate={{ rotate: getEarRotation('left') }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              />

              {/* RIGHT EAR */}
              <motion.path
                d="M 142 75 L 168 30 C 172 24 162 18 152 24 L 116 56 Z"
                fill={colors.body}
                originX="142px"
                originY="75px"
                animate={{ rotate: getEarRotation('right') }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              />
              {/* Right Inner Ear */}
              <motion.path
                d="M 146 71 L 164 36 Q 156 32 151 35 L 125 58 Z"
                fill="#F87171"
                opacity="0.5"
                originX="142px"
                originY="75px"
                animate={{ rotate: getEarRotation('right') }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              />

              {/* HEAD ROUND */}
              <ellipse cx="100" cy="90" rx="46" ry="40" fill={colors.body} />

              {/* EYE LEFT */}
              {mood === 'happy' ? (
                // Happy curved eyes: ^ ^
                <path d="M 72 90 Q 80 82 88 90" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : mood === 'sad' ? (
                // Sad eyes: / \
                <path d="M 72 87 Q 80 96 88 89" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : mood === 'sleepy' ? (
                // Half closed eyes
                <g>
                  <path d="M 70 88 Q 80 93 90 88" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
                  <ellipse cx="80" cy="88" rx="8" ry="3" fill="#27272A" opacity="0.15" />
                </g>
              ) : (
                // Normal eyes (with blinking action)
                <motion.ellipse
                  cx="80"
                  cy="88"
                  rx="9"
                  ry="9"
                  fill="#27272A"
                  animate={
                    reducedMotion
                      ? {}
                      : { scaleY: [1, 1, 0.1, 1, 1] }
                  }
                  transition={
                    reducedMotion
                      ? {}
                      : {
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2.5,
                        }
                  }
                  originX="80px"
                  originY="88px"
                >
                  {/* Catchlights */}
                  <circle cx="77" cy="85" r="2.5" fill="#FFFFFF" />
                  {mood === 'excited' && <circle cx="83" cy="91" r="1.5" fill="#FFFFFF" />}
                </motion.ellipse>
              )}

              {/* EYE RIGHT */}
              {mood === 'happy' ? (
                // Happy curved eyes: ^ ^
                <path d="M 112 90 Q 120 82 128 90" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : mood === 'sad' ? (
                // Sad eyes
                <path d="M 112 89 Q 120 96 128 87" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : mood === 'sleepy' ? (
                // Half closed eyes
                <g>
                  <path d="M 110 88 Q 120 93 130 88" fill="none" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
                  <ellipse cx="120" cy="88" rx="8" ry="3" fill="#27272A" opacity="0.15" />
                </g>
              ) : (
                // Normal eyes (with blinking action)
                <motion.ellipse
                  cx="120"
                  cy="88"
                  rx="9"
                  ry="9"
                  fill="#27272A"
                  animate={
                    reducedMotion
                      ? {}
                      : { scaleY: [1, 1, 0.1, 1, 1] }
                  }
                  transition={
                    reducedMotion
                      ? {}
                      : {
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2.5,
                        }
                  }
                  originX="120px"
                  originY="88px"
                >
                  {/* Catchlights */}
                  <circle cx="117" cy="85" r="2.5" fill="#FFFFFF" />
                  {mood === 'excited' && <circle cx="123" cy="91" r="1.5" fill="#FFFFFF" />}
                </motion.ellipse>
              )}

              {/* PINK CHEEKS BLUSH */}
              <circle cx="66" cy="98" r="6" fill={colors.blush} />
              <circle cx="134" cy="98" r="6" fill={colors.blush} />

              {/* WHISKERS */}
              {/* Left Whiskers */}
              <line x1="62" y1="100" x2="42" y2="98" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              <line x1="62" y1="105" x2="40" y2="105" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              <line x1="62" y1="110" x2="44" y2="112" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

              {/* Right Whiskers */}
              <line x1="138" y1="100" x2="158" y2="98" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              <line x1="138" y1="105" x2="160" y2="105" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              <line x1="138" y1="110" x2="156" y2="112" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

              {/* MOUTH */}
              {isEating ? (
                // Eating chewing mouth (cycles open/close)
                <path
                  d="M 94 103 Q 100 114 106 103 Z"
                  fill="#7F1D1D"
                  stroke="#27272A"
                  strokeWidth="2"
                  className="animate-[pulse_0.2s_infinite]"
                />
              ) : mood === 'sad' ? (
                // Downward mouth
                <path d="M 94 108 Q 100 102 106 108" fill="none" stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
              ) : (
                // Classic cat "3" mouth
                <path d="M 93 103 A 3.5 3.5 0 0 0 100 103 A 3.5 3.5 0 0 0 107 103" fill="none" stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
              )}

              {/* TINY NOSE */}
              <polygon points="98,99 102,99 100,102" fill="#E11D48" stroke="#E11D48" strokeWidth="1" strokeLinejoin="round" />
            </motion.g>
          </svg>

          {/* Falling Crumbs Animation Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {crumbs.map(c => (
              <span
                key={c.id}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-600/80 dark:bg-amber-500/80 crumb"
                style={{
                  left: '100px',
                  top: '120px',
                  '--x': `${c.x}px`,
                  '--y': `${c.y}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Rewards Loop Controls (Fish Count & Feed Button) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 px-6 py-4.5 rounded-[20px] glass-card shadow-sm w-full max-w-sm">
        {/* Fish Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <div className="p-3 bg-accent-orange/10 dark:bg-accent-orange/20 rounded-xl flex items-center justify-center text-accent-orange relative">
            <Fish className="w-6 h-6 animate-[bounce_3s_infinite]" aria-hidden="true" />
            {fishCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-orange text-[10px] text-white font-bold items-center justify-center">
                  !
                </span>
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">My Fish Stash</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100" id="fish-counter-label" aria-label={`${fishCount} fish available`}>
              {fishCount} <span className="text-xs font-medium text-zinc-500">{fishCount === 1 ? 'fish' : 'fish'}</span>
            </p>
          </div>
        </div>

        {/* Feed Button */}
        <button
          onClick={onFeed}
          disabled={fishCount === 0 || isEating}
          className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer ${
            fishCount === 0
              ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 cursor-not-allowed border border-zinc-200/50 dark:border-zinc-800'
              : isEating
              ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 cursor-wait border border-amber-200/50 dark:border-amber-900/30'
              : 'bg-accent-orange hover:bg-orange-600 text-white hover:shadow-orange-200 dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0'
          }`}
          aria-label={fishCount === 0 ? "No fish in stash to feed cat" : `Feed cat 1 fish`}
          id="feed-cat-button"
        >
          <Volume2 className={`w-4 h-4 ${isEating ? 'animate-pulse' : ''}`} />
          <span>{isEating ? 'Feeding...' : 'Feed Neko'}</span>
        </button>
      </div>
    </div>
  );
}
