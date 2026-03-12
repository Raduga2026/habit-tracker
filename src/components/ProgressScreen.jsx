import React, { useState } from 'react';
import { getMonthHeatmapData, getStreak, getHabitStats } from '../utils/dateHelpers';
import { useHabits } from '../hooks/useStorage';
import { useTheme } from '../context/ThemeContext';
import { logsStorage } from '../utils/storage';

export default function ProgressScreen() {
  const { habits } = useHabits();
  const { theme } = useTheme();
  const [selectedStatsPeriod, setSelectedStatsPeriod] = useState(7);

  const heatmapData = getMonthHeatmapData();
  const streak = getStreak();
  const activeHabits = habits.filter(h => h.isActive);

  const weeksData = [];
  let currentWeek = [];
  heatmapData.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeksData.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeksData.push(currentWeek);
  }

  const getHeatmapColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-600/40';
    if (percentage < 25) return 'bg-rose-300';
    if (percentage < 50) return 'bg-rose-500';
    if (percentage < 75) return 'bg-mint-400';
    return 'bg-mint-600';
  };

  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold">Твой Прогресс</h1>
          <p className="text-sm opacity-80 mt-2">
            Отслеживай свой путь к целям
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Streak Card */}
        <div className={`${theme.streakCardBg} text-white rounded-2xl p-6 shadow-lg`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">🔥</div>
            <div className="text-gray-100 text-sm mb-1">Текущая серия</div>
            <div className="text-4xl font-bold">{streak}</div>
            <div className="text-sm mt-2 opacity-90">дней подряд!</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className={`${theme.cardBg} rounded-2xl p-6 shadow-sm`}>
          <h2 className={`font-semibold ${theme.cardText} mb-4`}>Активность по дням</h2>
          <div className="space-y-2">
            {weeksData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex gap-1 justify-between">
                {week.map(day => (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`w-8 h-8 rounded-md ${getHeatmapColor(day.percentage)} cursor-pointer ${theme.heatmapRing} hover:ring-2 transition-all`}
                    title={`${day.date}: ${day.completed}/${day.total} привычек`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div className={`mt-4 text-xs ${theme.cardText} opacity-60`}>
            Зелёный = 100%, Розовый = менее 100%
          </div>
        </div>

        {/* Day detail modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${theme.cardBg} rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl`}>
              <h3 className={`font-semibold ${theme.cardText} mb-2`}>{selectedDay.date}</h3>
              <p className={`text-sm ${theme.cardText} mb-1`}>
                {selectedDay.completed}/{selectedDay.total} привычек
              </p>
              <p className={`text-xs ${theme.cardText} opacity-60 mb-3`}>
                {selectedDay.percentage}% выполнено
              </p>
              {logsStorage.getByDate(selectedDay.date).mood && (
                <p className={`text-sm ${theme.cardText} mb-2`}>
                  Настроение: {logsStorage.getByDate(selectedDay.date).mood}
                </p>
              )}
              {logsStorage.getByDate(selectedDay.date).morningReflection && (
                <div className={`text-xs ${theme.cardText} opacity-70 mb-2`}>
                  <strong>Утро:</strong> {JSON.stringify(logsStorage.getByDate(selectedDay.date).morningReflection)}
                </div>
              )}
              {logsStorage.getByDate(selectedDay.date).eveningReflection && (
                <div className={`text-xs ${theme.cardText} opacity-70 mb-2`}>
                  <strong>Вечер:</strong> {JSON.stringify(logsStorage.getByDate(selectedDay.date).eveningReflection)}
                </div>
              )}
              <button
                onClick={() => setSelectedDay(null)}
                className={`${theme.btnSecondary} mt-4 w-full py-2 rounded-2xl font-semibold`}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Habits Stats */}
        <div className={`${theme.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
          <div className={`${theme.sectionHeaderBg} px-6 py-3 flex justify-between items-center`}>
            <h2 className={`font-semibold ${theme.sectionHeaderText}`}>Статистика привычек</h2>
            <div className="flex gap-2">
              {[7, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedStatsPeriod(days)}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    selectedStatsPeriod === days
                      ? theme.statsActiveBtnBg
                      : theme.statsInactiveBtnBg
                  }`}
                >
                  {days}д
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {activeHabits.length === 0 ? (
              <p className={`text-center ${theme.cardText} opacity-60 py-4`}>
                Нет активных привычек
              </p>
            ) : (
              activeHabits.map(habit => {
                const stats = getHabitStats(habit.id, selectedStatsPeriod);
                return (
                  <div key={habit.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${theme.cardText}`}>
                        {habit.emoji} {habit.title}
                      </span>
                      <span className={`text-sm font-bold ${theme.statPercentText}`}>
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-full ${theme.statBarClass} rounded-full transition-all duration-300`}
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
