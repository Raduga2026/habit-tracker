import React, { useState } from 'react';
import { getTodayString, formatDate, formatDayName, getDailyProgress, getHabitsByTimeOfDay } from '../utils/dateHelpers';
import { useLogs, useUser } from '../hooks/useStorage';
import { logsStorage } from '../utils/storage';
import Confetti from './Confetti';
import HabitGroup from './HabitGroup';
import ProgressBar from './ProgressBar';

export default function TodayScreen() {
  const today = getTodayString();
  const { logs, toggleHabit } = useLogs();
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = getDailyProgress(today);
  const habitsByTime = getHabitsByTimeOfDay();
  const todayLog = logs[today] || { habits: {} };

  const handleToggleHabit = (habitId) => {
    // special cases for reflections
    if (habitId === 'h4') {
      // series of questions for morning reflection
      const q1 = window.prompt('Кто "Я"?', '');
      if (q1 === null) return;
      const q2 = window.prompt('Что полезного я сегодня сделаю для себя?', '');
      if (q2 === null) return;
      const q3 = window.prompt('Что полезного хочу сделать для других сегодня?', '');
      if (q3 === null) return;
      const q4 = window.prompt('Что я хочу изменить в себе сегодня?', '');
      if (q4 === null) return;
      logsStorage.updateDate(today, { morningReflection: { q1, q2, q3, q4 } });
      toggleHabit(today, habitId);
      return;
    }
    if (habitId === 'h7') {
      // series of questions for evening reflection
      const q1 = window.prompt('За что сегодня благодарна себе?', '');
      if (q1 === null) return;
      const q2 = window.prompt('Что сделала хорошего для других?', '');
      if (q2 === null) return;
      const q3 = window.prompt('Что у меня сегодня получилось хорошо?', '');
      if (q3 === null) return;
      const q4 = window.prompt('Чем я недовольна собой сегодня?', '');
      if (q4 === null) return;
      logsStorage.updateDate(today, { eveningReflection: { q1, q2, q3, q4 } });
      toggleHabit(today, habitId);
      return;
    }
    if (habitId === 'h8') {
      // mood selector
      const moods = ['😃','🙂','😐','😟','😢'];
      const choice = window.prompt(
        'Выбери настроение (1–5):\n1 😃\n2 🙂\n3 😐\n4 😟\n5 😢',
        '1'
      );
      const idx = parseInt(choice, 10);
      if (!idx || idx < 1 || idx > 5) return;
      logsStorage.updateDate(today, { mood: moods[idx - 1] });
      toggleHabit(today, habitId);
      return;
    }

    const wasCompleted = todayLog.habits[habitId];
    toggleHabit(today, habitId);

    // Check if this completes the day
    if (!wasCompleted) {
      const newProgress = { ...progress };
      newProgress.completed += 1;
      newProgress.percentage = Math.round((newProgress.completed / newProgress.total) * 100);

      if (newProgress.percentage === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50 pb-24">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-peach-400 text-white p-6 sm:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="text-sm opacity-90 font-medium">{formatDate(today)}</div>
          <div className="text-3xl sm:text-4xl font-bold capitalize mb-3">
            {formatDayName(today)}
          </div>
          {user.name && (
            <div className="text-lg sm:text-xl">
              ✨ Привет, {user.name}!
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-600">Прогресс дня</span>
            <span className="text-lg font-bold text-rose-600 bg-rose-50 px-4 py-1 rounded-full">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <ProgressBar percentage={progress.percentage} />
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-mint-400">
              {progress.percentage}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
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
