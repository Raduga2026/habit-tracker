import React, { useState } from 'react';
import { getTodayString, formatDate, formatDayName, getDailyProgress, getHabitsByTimeOfDay } from '../utils/dateHelpers';
import { useLogs, useUser } from '../hooks/useStorage';
import { useTheme } from '../context/ThemeContext';
import { logsStorage } from '../utils/storage';
import Confetti from './Confetti';
import HabitGroup from './HabitGroup';

export default function TodayScreen() {
  const today = getTodayString();
  const { logs, toggleHabit } = useLogs();
  const { user } = useUser();
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = getDailyProgress(today);
  const habitsByTime = getHabitsByTimeOfDay();
  const todayLog = logs[today] || { habits: {} };

  const handleToggleHabit = (habitId) => {
    if (habitId === 'h4') {
      const q1 = window.prompt('Что полезного Я сделаю сегодня для себя?', '');
      if (q1 === null) return;
      const q2 = window.prompt('Что полезного хочу сделать для других сегодня?', '');
      if (q2 === null) return;
      const q3 = window.prompt('Что я хочу изменить в себе сегодня?', '');
      if (q3 === null) return;
      logsStorage.updateDate(today, { morningReflection: { q1, q2, q3 } });
      toggleHabit(today, habitId);
      return;
    }
    if (habitId === 'h7') {
      const q1 = window.prompt('За что сегодня благодарен(а) себе?', '');
      if (q1 === null) return;
      const q2 = window.prompt('Что сделал(а) хорошего для других?', '');
      if (q2 === null) return;
      const q3 = window.prompt('Что у меня сегодня получилось хорошо?', '');
      if (q3 === null) return;
      const q4 = window.prompt('Чем я недоволен(а) собой сегодня?', '');
      if (q4 === null) return;
      logsStorage.updateDate(today, { eveningReflection: { q1, q2, q3, q4 } });
      toggleHabit(today, habitId);
      return;
    }
    if (habitId === 'h8') {
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
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 sm:p-8 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <div className="text-sm font-medium opacity-80 tracking-wide uppercase">
            {formatDate(today)} · {formatDayName(today)}
          </div>
          {user.name && (
            <div className="text-2xl sm:text-3xl italic font-semibold mt-2">
              Привет {user.name}!
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
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
