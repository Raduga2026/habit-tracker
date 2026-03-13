import React, { useState, useEffect } from 'react';
import { getTodayString, formatDate, formatDayName, getDailyProgress, getHabitsByTimeOfDay, getStreak, calculateXP } from '../utils/dateHelpers';
import { getLevelInfo } from '../utils/achievements';
import { useLogs, useUser, useAchievements } from '../hooks/useStorage';
import { useTheme } from '../context/ThemeContext';
import { logsStorage, achievementsStorage } from '../utils/storage';
import Confetti from './Confetti';
import HabitGroup from './HabitGroup';
import ReflectionModal from './ReflectionModal';

function MoodModal({ onSave, onCancel, theme }) {
  const moods = [
    { emoji: '😃', label: 'Отлично', value: 1 },
    { emoji: '🙂', label: 'Хорошо', value: 2 },
    { emoji: '😐', label: 'Нейтрально', value: 3 },
    { emoji: '😟', label: 'Не очень', value: 4 },
    { emoji: '😢', label: 'Плохо', value: 5 },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className={`w-full max-w-md ${theme.habitGroupBg} rounded-t-3xl p-6`}>
        <p className={`text-base font-semibold ${theme.cardText} mb-4 text-center`}>Как твоё настроение сегодня?</p>
        <div className="flex justify-around mb-6">
          {moods.map(m => (
            <button key={m.value} onClick={() => onSave(m.value)} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{m.emoji}</span>
              <span className={`text-xs ${theme.cardText} opacity-70`}>{m.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onCancel} className={`w-full py-3 rounded-2xl text-sm font-medium ${theme.navBtnInactive}`}>
          Отмена
        </button>
      </div>
    </div>
  );
}

export default function TodayScreen() {
  const today = getTodayString();
  const { logs, toggleHabit } = useLogs();
  const { user } = useUser();
  const { theme } = useTheme();
  const { syncAchievements } = useAchievements();
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakBroke, setStreakBroke] = useState(false);
  const [modal, setModal] = useState(null); // { habitId, questions, storageKey }

  const progress = getDailyProgress(today);
  const habitsByTime = getHabitsByTimeOfDay();
  const todayLog = logs[today] || { habits: {} };

  const streak = getStreak();
  const xp = calculateXP();
  const { level } = getLevelInfo(xp);

  useEffect(() => {
    const currentStreak = getStreak();
    const { lastStreakSeen } = achievementsStorage.get();
    if (lastStreakSeen > 1 && currentStreak === 0) {
      setStreakBroke(true);
    }
    achievementsStorage.updateLastStreak(currentStreak);
  }, []);

  const finishToggle = (habitId) => {
    const wasCompleted = todayLog.habits[habitId];
    toggleHabit(today, habitId);
    syncAchievements();
    if (!wasCompleted) {
      const newProgress = getDailyProgress(today);
      if (newProgress.percentage === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const handleToggleHabit = (habitId) => {
    if (habitId === 'h4') {
      setModal({
        habitId,
        storageKey: 'morningReflection',
        questions: [
          'Что полезного я сделаю сегодня для себя?',
          'Что полезного хочу сделать для других сегодня?',
          'Что я хочу изменить в себе сегодня?',
        ],
      });
      return;
    }
    if (habitId === 'h7') {
      setModal({
        habitId,
        storageKey: 'eveningReflection',
        questions: [
          'За что сегодня благодарна себе?',
          'Что сделала хорошего для других?',
          'Что у меня сегодня получилось хорошо?',
          'Чем я недовольна собой сегодня?',
        ],
      });
      return;
    }
    if (habitId === 'h8') {
      setModal({
        habitId,
        storageKey: 'mood',
        questions: ['Выбери настроение:'],
        isMood: true,
      });
      return;
    }

    finishToggle(habitId);
  };

  const handleModalSave = (answers) => {
    if (!modal) return;
    const { habitId, storageKey, isMood } = modal;
    if (isMood) {
      const moods = ['😃', '🙂', '😐', '😟', '😢'];
      const idx = parseInt(answers[0], 10);
      const mood = (idx >= 1 && idx <= 5) ? moods[idx - 1] : moods[0];
      logsStorage.updateDate(today, { mood });
    } else {
      const keys = ['q1', 'q2', 'q3', 'q4'];
      const obj = {};
      answers.forEach((a, i) => { obj[keys[i]] = a; });
      logsStorage.updateDate(today, { [storageKey]: obj });
    }
    finishToggle(habitId);
    setModal(null);
  };

  return (
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {showConfetti && <Confetti />}
      {modal && !modal.isMood && (
        <ReflectionModal
          questions={modal.questions}
          onSave={handleModalSave}
          onCancel={() => setModal(null)}
        />
      )}
      {modal && modal.isMood && (
        <MoodModal
          onSave={(idx) => handleModalSave([String(idx)])}
          onCancel={() => setModal(null)}
          theme={theme}
        />
      )}

      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 sm:p-8 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <div className="text-sm font-medium opacity-80 tracking-wide uppercase">
            {formatDate(today)} · {formatDayName(today)}
          </div>
          {user.name && (
            <div className="text-2xl sm:text-3xl italic font-semibold mt-2">
              Привет, {user.name}!
            </div>
          )}
          <div className="text-sm opacity-70 mt-2 italic font-light leading-snug">
            Привычки формируют жизнь. Но без трекера они забываются очень быстро.
          </div>
          {/* Streak + Level mini-badge */}
          <div className="flex items-center gap-3 mt-3">
            {streak > 0 && (
              <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
                🔥 {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
              </span>
            )}
            <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
              {level.emoji} {level.name}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">

        {/* Streak broke message */}
        {streakBroke && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">💪</div>
            <p className="text-sm text-amber-800 font-medium">Серия прервалась, но ты начинаешь снова сегодня!</p>
            <p className="text-xs text-amber-600 mt-1">Каждый день — новый старт.</p>
            <button
              onClick={() => setStreakBroke(false)}
              className="text-xs text-amber-500 mt-2 underline"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Progress */}
        <div className={`${theme.progressCardBg} rounded-3xl p-5 shadow-sm`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-semibold ${theme.cardText}`}>Прогресс дня</span>
            <span className={`text-base font-bold ${theme.progressTextAccent} ${theme.progressBgAccent} px-4 py-1 rounded-full`}>
              {progress.completed}/{progress.total}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.progressBarClass} transition-all duration-700 ease-out`}
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="mt-3 text-center">
            <div className={`text-3xl font-bold ${theme.progressTextAccent}`}>
              {progress.percentage}%
            </div>
            <div className={`text-xs mt-1 ${theme.cardText} opacity-60`}>
              {progress.percentage === 100 ? '🎉 Отлично сегодня!' : 'выполнено'}
            </div>
          </div>
        </div>

        {/* Habit Groups */}
        {habitsByTime.morning.length > 0 && (
          <HabitGroup
            title="☀️ Утренние практики"
            habits={habitsByTime.morning}
            today={today}
            todayLog={todayLog}
            onToggle={handleToggleHabit}
          />
        )}

        {habitsByTime.daytime.length > 0 && (
          <HabitGroup
            title="🌤️ День"
            habits={habitsByTime.daytime}
            today={today}
            todayLog={todayLog}
            onToggle={handleToggleHabit}
          />
        )}

        {habitsByTime.evening.length > 0 && (
          <HabitGroup
            title="🌙 Вечерние практики"
            habits={habitsByTime.evening}
            today={today}
            todayLog={todayLog}
            onToggle={handleToggleHabit}
          />
        )}
      </div>
    </div>
  );
}
